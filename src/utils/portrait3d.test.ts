import test from "node:test";
import assert from "node:assert/strict";
import {
  removeStudioBackground,
  computePortraitDepth,
  computeAmberRimWeight,
  buildPortraitPointCloud,
} from "./portrait3d";

test("removeStudioBackground clears exterior white backdrop while keeping interior facial skin and dark shirt", () => {
  const w = 10;
  const h = 10;
  const pixels = new Uint8ClampedArray(w * h * 4);

  // Fill entire frame with bright studio white
  for (let i = 0; i < w * h; i++) {
    pixels[i * 4] = 252;
    pixels[i * 4 + 1] = 252;
    pixels[i * 4 + 2] = 252;
    pixels[i * 4 + 3] = 255;
  }

  // Paint centered silhouette (x: 3..6, y: 3..6) with warm skin + bright eye specular inside
  for (let y = 3; y <= 6; y++) {
    for (let x = 3; x <= 6; x++) {
      const idx = (y * w + x) * 4;
      if (x === 4 && y === 4) {
        // Interior bright specular (sealed inside skin/hair boundary) must NOT be deleted
        pixels[idx] = 248;
        pixels[idx + 1] = 248;
        pixels[idx + 2] = 248;
      } else {
        pixels[idx] = 195;
        pixels[idx + 1] = 148;
        pixels[idx + 2] = 122;
      }
      pixels[idx + 3] = 255;
    }
  }

  const cleaned = removeStudioBackground(pixels, w, h);

  // Corner background pixel becomes transparent
  assert.equal(cleaned[3], 0);
  // Bottom-right border pixel becomes transparent
  assert.equal(cleaned[(9 * w + 9) * 4 + 3], 0);
  // Center interior pixel stays opaque
  assert.equal(cleaned[(4 * w + 4) * 4 + 3], 255);
  assert.equal(cleaned[(5 * w + 5) * 4 + 3], 255);
});

test("computePortraitDepth peaks at center facial planes and recedes toward edges", () => {
  const centerDepth = computePortraitDepth(0, 0.14, 0.75);
  const edgeDepth = computePortraitDepth(0.85, 0.75, 0.25);
  assert.ok(centerDepth > edgeDepth);
  assert.ok(centerDepth <= 1 && edgeDepth >= 0);
});

test("computeAmberRimWeight highlights upper-right edge over lower-left interior", () => {
  const rimRight = computeAmberRimWeight(0.75, 0.45, 0.65);
  const rimLeft = computeAmberRimWeight(-0.6, -0.6, 0.2);
  assert.ok(rimRight > rimLeft);
});

test("buildPortraitPointCloud skips transparent pixels and outputs bounded 3D buffers", () => {
  const w = 16;
  const h = 16;
  const rgba = new Uint8ClampedArray(w * h * 4);

  // Only fill an interior 8x8 portrait block with opaque pixels
  for (let y = 4; y < 12; y++) {
    for (let x = 4; x < 12; x++) {
      const idx = (y * w + x) * 4;
      rgba[idx] = 210;
      rgba[idx + 1] = 175;
      rgba[idx + 2] = 150;
      rgba[idx + 3] = 255;
    }
  }

  const cloud = buildPortraitPointCloud(rgba, w, h, { step: 2 });
  assert.ok(cloud.count > 0 && cloud.count <= 16);
  assert.equal(cloud.positions.length, cloud.count * 3);
  assert.equal(cloud.normals.length, cloud.count * 3);
  assert.equal(cloud.colors.length, cloud.count * 3);
  assert.equal(cloud.sizes.length, cloud.count);
  assert.equal(cloud.seeds.length, cloud.count);
  assert.equal(cloud.rimWeights.length, cloud.count);

  const nLen = Math.hypot(cloud.normals[0], cloud.normals[1], cloud.normals[2]);
  assert.ok(Math.abs(nLen - 1) < 1e-4);
  assert.ok(cloud.normals[2] > 0);
});
