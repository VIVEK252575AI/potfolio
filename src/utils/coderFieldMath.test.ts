import test from "node:test";
import assert from "node:assert/strict";
import {
  computeScrollDynamics,
  projectWavePoint,
  evaluateVortexStreamPoint,
} from "./coderFieldMath";

test("computeScrollDynamics clamps progress and handles zero maxScroll", () => {
  const zeroMax = computeScrollDynamics(200, 0, 0, 16);
  assert.equal(zeroMax.progress, 1);

  const mid = computeScrollDynamics(500, 1000, 420, 16);
  assert.equal(mid.progress, 0.5);
  assert.ok(mid.velocity > 0);
  assert.ok(mid.warpFactor > 0);

  const neg = computeScrollDynamics(-50, 1000, 0, 16);
  assert.equal(neg.progress, 0);
});

test("projectWavePoint reacts to scrollProgress and pointer proximity", () => {
  const top = projectWavePoint(10, 8, 24, 16, 1440, 900, 1.5, 0, 0, -9999, -9999);
  const scrolled = projectWavePoint(10, 8, 24, 16, 1440, 900, 1.5, 0.75, 1.2, -9999, -9999);

  assert.ok(Number.isFinite(top.x) && Number.isFinite(top.y));
  assert.ok(Number.isFinite(scrolled.x) && Number.isFinite(scrolled.y));
  assert.notEqual(Math.round(top.y), Math.round(scrolled.y));

  // Pointer placed directly near the projected coordinate must exert influence
  const nearPointer = projectWavePoint(
    10,
    8,
    24,
    16,
    1440,
    900,
    1.5,
    0,
    0,
    top.x + 12,
    top.y + 8
  );
  assert.ok(nearPointer.pointerInfluence > 0.5);
  assert.ok(nearPointer.alpha >= top.alpha);
});

test("evaluateVortexStreamPoint shifts focal center smoothly across scroll", () => {
  const pStart = evaluateVortexStreamPoint(2, 0.75, 1440, 900, 2.0, 0);
  const pEnd = evaluateVortexStreamPoint(2, 0.75, 1440, 900, 2.0, 1.0);

  assert.ok(Number.isFinite(pStart.x) && Number.isFinite(pStart.y));
  assert.ok(Number.isFinite(pEnd.x) && Number.isFinite(pEnd.y));
  assert.ok(pEnd.x < pStart.x, "Vortex focal orbit shifts leftward as user scrolls");
  assert.ok(pStart.amberMix > 0.5);
});
