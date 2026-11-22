export interface ScrollDynamics {
  progress: number;
  velocity: number;
  tiltAngle: number;
  warpFactor: number;
}

export interface ProjectedWavePoint {
  x: number;
  y: number;
  depth: number;
  scale: number;
  alpha: number;
  amberMix: number;
  cyanMix: number;
  pointerInfluence: number;
}

export interface VortexStreamPoint {
  x: number;
  y: number;
  tangentAngle: number;
  intensity: number;
  amberMix: number;
}

export const CODER_TOKENS = [
  "const",
  "=>",
  "{ }",
  "async",
  "await",
  "0xF4",
  "std::",
  "fn()",
  "tensor",
  "O(log n)",
  "return",
  "export",
  "model()",
  "[]",
  "&&",
  "::",
  "1011",
  "infer()",
] as const;

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Computes normalized scroll progress, clamped velocity, horizon tilt, and
 * gravitational warp factor from scroll metrics.
 */
export function computeScrollDynamics(
  scrollY: number,
  maxScroll: number,
  prevScrollY: number,
  dtMs: number
): ScrollDynamics {
  const safeMax = maxScroll > 0 ? maxScroll : 1;
  const progress = clamp(scrollY / safeMax, 0, 1);
  const safeDt = Math.max(dtMs, 8);
  const rawVelocity = (scrollY - prevScrollY) / safeDt; // px per ms
  const velocity = clamp(rawVelocity, -3.5, 3.5);
  const tiltAngle = -0.32 + progress * 0.64 + velocity * 0.04;
  const warpFactor = clamp(Math.abs(velocity) * 0.45 + Math.sin(progress * Math.PI) * 0.55, 0, 1.35);

  return {
    progress,
    velocity,
    tiltAngle,
    warpFactor,
  };
}

/**
 * Projects a 3D topographic wave lattice point onto 2D viewport coordinates.
 * Responds to scroll progress (rotates wave horizon & shifts phase),
 * scroll velocity (vertical shear & wave amplitude), and pointer proximity.
 */
export function projectWavePoint(
  col: number,
  row: number,
  cols: number,
  rows: number,
  width: number,
  height: number,
  timeSec: number,
  scrollProgress: number,
  scrollVelocity: number,
  pointerX: number,
  pointerY: number
): ProjectedWavePoint {
  const u = cols > 1 ? col / (cols - 1) - 0.5 : 0; // -0.5..0.5
  const v = rows > 1 ? row / (rows - 1) - 0.5 : 0; // -0.5..0.5

  // Undulating topological height driven by time + scroll progress
  const scrollPhase = scrollProgress * Math.PI * 3.2;
  const speedBoost = 1 + Math.min(Math.abs(scrollVelocity) * 0.9, 1.8);
  const wave1 = Math.sin(u * 6.5 + timeSec * 0.55 + scrollPhase) * 0.16;
  const wave2 = Math.cos(v * 5.2 - timeSec * 0.42 + scrollPhase * 0.75) * 0.14;
  const ridge = Math.sin((u + v) * 8.0 + timeSec * 0.35 * speedBoost) * 0.07;

  // Gravitational vortex depression that travels diagonally as user scrolls
  const vortexU = -0.18 + scrollProgress * 0.36;
  const vortexV = -0.08 + Math.sin(scrollProgress * Math.PI) * 0.18;
  const du = u - vortexU;
  const dv = v - vortexV;
  const distVortex = Math.sqrt(du * du + dv * dv);
  const gravityPull = Math.exp(-distVortex * 6.0) * 0.35;

  const y3d = wave1 + wave2 + ridge - gravityPull;

  // Rotate slightly around Y & X based on scroll progress
  const yaw = (scrollProgress - 0.5) * 0.45 + Math.sin(timeSec * 0.12) * 0.08;
  const pitch = 0.58 + Math.sin(scrollProgress * Math.PI) * 0.18;

  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const rx = u * cosY - v * sinY;
  const rz = u * sinY + v * cosY;

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const ry = y3d * cosP - rz * sinP;
  const depth = y3d * sinP + rz * cosP + 1.45; // camera distance offset

  const fov = Math.min(width, height) * 1.25;
  const safeDepth = Math.max(depth, 0.35);
  const scale = fov / safeDepth;

  let sx = width * 0.5 + rx * scale * 1.45;
  let sy = height * 0.56 + ry * scale * 0.92 - (scrollProgress - 0.5) * height * 0.12;

  // Interactive pointer magnetic deflection
  let pointerInfluence = 0;
  if (pointerX > -1000 && pointerY > -1000) {
    const dx = sx - pointerX;
    const dy = sy - pointerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 165;
    if (dist < radius && dist > 0.001) {
      pointerInfluence = 1 - dist / radius;
      const push = pointerInfluence * pointerInfluence * 28;
      sx += (dx / dist) * push;
      sy += (dy / dist) * push;
    }
  }

  const depthNorm = clamp(1 - (safeDepth - 0.85) / 1.4, 0, 1);
  const amberMix = clamp(Math.exp(-distVortex * 5.2) * 0.95 + pointerInfluence * 0.5, 0, 1);
  const cyanMix = clamp((1 - amberMix) * (0.35 + ridge * 3.0) + pointerInfluence * 0.25, 0, 1);
  const alpha = clamp(0.08 + depthNorm * 0.34 + amberMix * 0.25 + pointerInfluence * 0.28, 0.04, 0.78);

  return {
    x: sx,
    y: sy,
    depth: safeDepth,
    scale: clamp(scale / fov, 0.35, 1.8),
    alpha,
    amberMix,
    cyanMix,
    pointerInfluence,
  };
}

/**
 * Evaluates a point along one of the curved code-stream accretion orbits.
 * Mirrors a cosmic event-horizon code ribbon that shifts with scroll progress.
 */
export function evaluateVortexStreamPoint(
  streamIndex: number,
  t: number,
  width: number,
  height: number,
  timeSec: number,
  scrollProgress: number
): VortexStreamPoint {
  const clampedT = clamp(t, 0, 1);
  // Focal singularity center shifts cleanly across the viewport with scroll
  const centerX = width * (0.76 - scrollProgress * 0.44);
  const centerY = height * (0.42 + Math.sin(scrollProgress * Math.PI) * 0.16);

  const laneOffset = (streamIndex - 3.5) * (Math.min(width, height) * 0.032);
  const startX = width * 1.06;
  const startY = height * (0.12 + (streamIndex / 8) * 0.76);

  const angle = clampedT * Math.PI * 1.45 + timeSec * 0.18 + streamIndex * 0.24 + scrollProgress * 2.2;
  const radius = lerp(Math.max(width, height) * 0.58, Math.min(width, height) * 0.11 + Math.abs(laneOffset), clampedT);

  const curveX = lerp(startX, centerX + Math.cos(angle) * radius, clampedT);
  const curveY = lerp(startY, centerY + Math.sin(angle) * radius * 0.62, clampedT);

  const nextT = clamp(clampedT + 0.01, 0, 1);
  const nextAngle = nextT * Math.PI * 1.45 + timeSec * 0.18 + streamIndex * 0.24 + scrollProgress * 2.2;
  const nextRadius = lerp(Math.max(width, height) * 0.58, Math.min(width, height) * 0.11 + Math.abs(laneOffset), nextT);
  const nx = lerp(startX, centerX + Math.cos(nextAngle) * nextRadius, nextT);
  const ny = lerp(startY, centerY + Math.sin(nextAngle) * nextRadius * 0.62, nextT);

  const tangentAngle = Math.atan2(ny - curveY, nx - curveX);
  const amberMix = clamp(Math.pow(clampedT, 1.5), 0, 1);
  const intensity = clamp(Math.sin(clampedT * Math.PI) * 0.85 + 0.15, 0.1, 1);

  return {
    x: curveX,
    y: curveY,
    tangentAngle,
    intensity,
    amberMix,
  };
}
