export interface PortraitPointCloudData {
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;
  rimWeights: Float32Array;
  count: number;
}

export interface PortraitCloudOptions {
  step?: number;
  widthUnits?: number;
  heightUnits?: number;
  depthUnits?: number;
  alphaThreshold?: number;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Removes bright neutral studio backgrounds connected to image borders
 * using a seeded BFS flood-fill plus border-halo attenuation.
 * Interior highlights (eyes, teeth, specular skin) stay untouched.
 */
export function removeStudioBackground(
  source: Uint8ClampedArray,
  width: number,
  height: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(source);
  if (width <= 0 || height <= 0) return out;

  const total = width * height;
  const visited = new Uint8Array(total);
  const bgMask = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isBackgroundCandidate = (idx: number): boolean => {
    const o = idx * 4;
    const a = out[o + 3];
    if (a < 28) return true;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    const minC = Math.min(r, g, b);
    const maxC = Math.max(r, g, b);
    const chroma = maxC - minC;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma >= 216 && chroma <= 28;
  };

  const enqueue = (idx: number) => {
    if (visited[idx]) return;
    visited[idx] = 1;
    if (isBackgroundCandidate(idx)) {
      bgMask[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < width; x++) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    enqueue(y * width);
    enqueue(y * width + (width - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;

    if (x > 0) enqueue(idx - 1);
    if (x < width - 1) enqueue(idx + 1);
    if (y > 0) enqueue(idx - width);
    if (y < height - 1) enqueue(idx + width);
  }

  for (let i = 0; i < total; i++) {
    if (bgMask[i]) {
      out[i * 4 + 3] = 0;
      continue;
    }
    const x = i % width;
    const y = (i - x) / width;
    let bgNeighbors = 0;
    if (x > 0 && bgMask[i - 1]) bgNeighbors++;
    if (x < width - 1 && bgMask[i + 1]) bgNeighbors++;
    if (y > 0 && bgMask[i - width]) bgNeighbors++;
    if (y < height - 1 && bgMask[i + width]) bgNeighbors++;

    if (bgNeighbors > 0) {
      const o = i * 4;
      const r = out[o];
      const g = out[o + 1];
      const b = out[o + 2];
      const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const feather = clamp01(1 - (bgNeighbors * 0.18 + Math.max(0, luma - 0.6) * 0.65));
      out[o + 3] = Math.round(out[o + 3] * feather);
    }
  }

  return out;
}

/**
 * Computes anatomical 3D relief depth Z (in normalized depth units [0, 1])
 * so central facial planes emerge forward in 3D while ears/hair/shoulders
 * wrap smoothly backward in space.
 */
export function computePortraitDepth(
  nx: number,
  ny: number,
  luma01: number
): number {
  const faceDist = Math.hypot(nx * 1.18, (ny - 0.14) * 1.05);
  const torsoFactor = ny < -0.15 ? clamp01((-ny - 0.15) * 1.1) : 0;
  const cranialDome = Math.max(0, 1 - faceDist * faceDist * 1.15);
  const shoulderShelf = torsoFactor * Math.max(0, 1 - nx * nx * 0.95) * 0.52;
  const relief = luma01 * 0.24;
  return clamp01(cranialDome * 0.76 + shoulderShelf * 0.36 + relief - 0.08);
}

/**
 * Produces warm amber rim-light intensity concentrated on the upper-right
 * hair/cheek silhouette and warm studio accents (inspired by reference).
 */
export function computeAmberRimWeight(
  nx: number,
  ny: number,
  luma01: number
): number {
  const rightRim = clamp01((nx + 0.15) * 0.9) * clamp01((ny + 0.55) * 0.85);
  const radialRim = clamp01((Math.hypot(nx * 1.1, ny - 0.08) - 0.34) * 1.7);
  const highlightAccent = clamp01(luma01 * 1.15 - 0.15);
  return clamp01(rightRim * 0.55 + radialRim * 0.45 + highlightAccent * 0.22);
}

/**
 * Converts a background-removed RGBA portrait buffer into 3D halftone point-cloud
 * buffers ready for Three.js ShaderMaterial rendering, including surface normals
 * for directional/spotlight relief shading.
 */
export function buildPortraitPointCloud(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  options: PortraitCloudOptions = {}
): PortraitPointCloudData {
  const step = Math.max(1, options.step ?? 4);
  const widthUnits = options.widthUnits ?? 4.2;
  const heightUnits = options.heightUnits ?? 4.2 * (height / Math.max(1, width));
  const depthUnits = options.depthUnits ?? 1.45;
  const alphaThreshold = options.alphaThreshold ?? 42;

  const estCount = Math.ceil(width / step) * Math.ceil(height / step);
  const positions = new Float32Array(estCount * 3);
  const normals = new Float32Array(estCount * 3);
  const colors = new Float32Array(estCount * 3);
  const sizes = new Float32Array(estCount);
  const seeds = new Float32Array(estCount);
  const rimWeights = new Float32Array(estCount);

  const sampleLumaAt = (sx: number, sy: number): number => {
    const cx = Math.max(0, Math.min(width - 1, sx));
    const cy = Math.max(0, Math.min(height - 1, sy));
    const o = (cy * width + cx) * 4;
    if (rgba[o + 3] < alphaThreshold) return 0;
    return (0.2126 * rgba[o] + 0.7152 * rgba[o + 1] + 0.0722 * rgba[o + 2]) / 255;
  };

  let count = 0;

  for (let py = 0; py < height; py += step) {
    const ny = 1 - (py / Math.max(1, height - 1)) * 2;
    const rowOffset = Math.floor(py / step) % 2 === 1 ? step * 0.5 : 0;

    for (let pxBase = 0; pxBase < width; pxBase += step) {
      const px = Math.min(width - 1, Math.round(pxBase + rowOffset));
      const idx = (py * width + px) * 4;
      const alpha = rgba[idx + 3];
      if (alpha < alphaThreshold) continue;

      const r = rgba[idx] / 255;
      const g = rgba[idx + 1] / 255;
      const b = rgba[idx + 2] / 255;
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const alpha01 = alpha / 255;

      // Discard super-faint white edge artifacts that survived edge erosion
      if (alpha01 < 0.35 && luma > 0.84) continue;

      const nx = (px / Math.max(1, width - 1)) * 2 - 1;
      const depth01 = computePortraitDepth(nx, ny, luma);
      const rim = computeAmberRimWeight(nx, ny, luma);

      // Finite-difference depth gradient for sculptural 3D surface normals
      const dxN = 2 / Math.max(1, width - 1);
      const dyN = 2 / Math.max(1, height - 1);
      const depthR = computePortraitDepth(nx + dxN * step, ny, sampleLumaAt(px + step, py)) * depthUnits;
      const depthL = computePortraitDepth(nx - dxN * step, ny, sampleLumaAt(px - step, py)) * depthUnits;
      const depthU = computePortraitDepth(nx, ny + dyN * step, sampleLumaAt(px, py - step)) * depthUnits;
      const depthD = computePortraitDepth(nx, ny - dyN * step, sampleLumaAt(px, py + step)) * depthUnits;

      const spanX = Math.max(1e-4, dxN * step * widthUnits);
      const spanY = Math.max(1e-4, dyN * step * heightUnits);
      const dzdx = (depthR - depthL) / spanX;
      const dzdy = (depthU - depthD) / spanY;
      const normLen = Math.hypot(-dzdx, -dzdy, 1) || 1;

      // Halftone luminance-to-amber-silver palette
      const contrastLuma = clamp01(Math.pow(clamp01(luma * 1.08), 0.85));
      const silverR = 0.16 + contrastLuma * 0.82;
      const silverG = 0.17 + contrastLuma * 0.81;
      const silverB = 0.19 + contrastLuma * 0.78;

      // Warm amber tint blend on rim / halftone ridges
      const amberMix = rim * 0.78;
      const cr = silverR * (1 - amberMix) + (0.98 * contrastLuma + 0.22) * amberMix;
      const cg = silverG * (1 - amberMix) + (0.66 * contrastLuma + 0.11) * amberMix;
      const cb = silverB * (1 - amberMix) + (0.24 * contrastLuma + 0.03) * amberMix;

      const p3 = count * 3;
      positions[p3] = nx * (widthUnits * 0.5);
      positions[p3 + 1] = ny * (heightUnits * 0.5);
      positions[p3 + 2] = (depth01 - 0.35) * depthUnits;

      normals[p3] = -dzdx / normLen;
      normals[p3 + 1] = -dzdy / normLen;
      normals[p3 + 2] = 1 / normLen;

      colors[p3] = clamp01(cr);
      colors[p3 + 1] = clamp01(cg);
      colors[p3 + 2] = clamp01(cb);

      sizes[count] = (0.55 + contrastLuma * 0.95 + rim * 0.25) * alpha01;
      // Deterministic hash seed in [0, 1]
      const hash = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
      seeds[count] = hash - Math.floor(hash);
      rimWeights[count] = rim;
      count++;
    }
  }

  return {
    positions: positions.slice(0, count * 3),
    normals: normals.slice(0, count * 3),
    colors: colors.slice(0, count * 3),
    sizes: sizes.slice(0, count),
    seeds: seeds.slice(0, count),
    rimWeights: rimWeights.slice(0, count),
    count,
  };
}
