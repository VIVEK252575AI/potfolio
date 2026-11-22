import test from "node:test";
import assert from "node:assert/strict";
import {
  computeSpotlightRig,
  evaluateSpotlightIllumination,
} from "./spotlight3d";

test("computeSpotlightRig maps pointer coordinates to 3D origin, target, and unit direction", () => {
  const rig = computeSpotlightRig(0.6, -0.4);
  assert.ok(rig.origin.x > rig.target.x);
  assert.ok(rig.target.x > 0);
  assert.ok(rig.target.y < 0);

  const dirLen = Math.hypot(rig.direction.x, rig.direction.y, rig.direction.z);
  assert.ok(Math.abs(dirLen - 1) < 1e-6);
  assert.ok(rig.direction.z < 0);
});

test("evaluateSpotlightIllumination peaks on surface inside spotlight cone facing beam", () => {
  const rig = computeSpotlightRig(0.5, 0.2, {
    originSpreadX: 3.0,
    originSpreadY: 2.2,
    originZ: 4.0,
    targetSpreadX: 1.5,
    targetSpreadY: 1.1,
    targetZ: 0,
  });

  const litPoint = { x: rig.target.x, y: rig.target.y, z: 0.2 };
  const frontNormal = { x: 0, y: 0, z: 1 };
  const farUnlitPoint = { x: -4.8, y: -3.8, z: 0 };

  const onBeam = evaluateSpotlightIllumination(
    litPoint,
    frontNormal,
    rig.origin,
    rig.direction
  );
  const offBeam = evaluateSpotlightIllumination(
    farUnlitPoint,
    frontNormal,
    rig.origin,
    rig.direction
  );

  assert.ok(onBeam > 0.4, `Expected strong spotlight intensity, got ${onBeam}`);
  assert.equal(offBeam, 0);
});

test("evaluateSpotlightIllumination weights surface normal orientation for 3D depth relief", () => {
  const rig = computeSpotlightRig(0, 0, {
    originZ: 4,
    targetZ: 0,
  });
  const point = { x: 0, y: 0, z: 0 };

  const facingLight = evaluateSpotlightIllumination(
    point,
    { x: 0, y: 0, z: 1 },
    rig.origin,
    rig.direction
  );
  const grazingLight = evaluateSpotlightIllumination(
    point,
    { x: 1, y: 0, z: 0 },
    rig.origin,
    rig.direction
  );

  assert.ok(facingLight > grazingLight * 2);
});
