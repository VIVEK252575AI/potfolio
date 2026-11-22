export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SpotlightRig {
  origin: Vec3;
  target: Vec3;
  direction: Vec3;
}

export interface SpotlightRigOptions {
  originSpreadX?: number;
  originSpreadY?: number;
  originZ?: number;
  targetSpreadX?: number;
  targetSpreadY?: number;
  targetZ?: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const span = Math.max(1e-6, edge1 - edge0);
  const t = clamp((x - edge0) / span, 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Maps normalized cursor coordinates [-1, 1] into a 3D spotlight origin and
 * aim target so the beam rakes across 3D geometry at an oblique angle,
 * emphasizing sculptural depth and metallic bevel highlights.
 */
export function computeSpotlightRig(
  nx: number,
  ny: number,
  options: SpotlightRigOptions = {}
): SpotlightRig {
  const cx = clamp(nx, -1.25, 1.25);
  const cy = clamp(ny, -1.25, 1.25);

  const originSpreadX = options.originSpreadX ?? 4.2;
  const originSpreadY = options.originSpreadY ?? 3.2;
  const originZ = options.originZ ?? 4.8;
  const targetSpreadX = options.targetSpreadX ?? 2.1;
  const targetSpreadY = options.targetSpreadY ?? 1.7;
  const targetZ = options.targetZ ?? 0.0;

  const ox = cx * originSpreadX;
  const oy = cy * originSpreadY + 0.55;
  const oz = originZ;

  const tx = cx * targetSpreadX;
  const ty = cy * targetSpreadY;
  const tz = targetZ;

  const dx = tx - ox;
  const dy = ty - oy;
  const dz = tz - oz;
  const len = Math.hypot(dx, dy, dz) || 1;

  return {
    origin: { x: ox, y: oy, z: oz },
    target: { x: tx, y: ty, z: tz },
    direction: { x: dx / len, y: dy / len, z: dz / len },
  };
}

/**
 * Evaluates spotlight illumination intensity [0, 1] at a 3D surface point
 * given its surface normal, cone angles, and falloff range.
 */
export function evaluateSpotlightIllumination(
  point: Vec3,
  normal: Vec3,
  spotOrigin: Vec3,
  spotDir: Vec3,
  cosOuter = 0.72,
  cosInner = 0.94,
  maxRange = 12
): number {
  const vx = point.x - spotOrigin.x;
  const vy = point.y - spotOrigin.y;
  const vz = point.z - spotOrigin.z;
  const dist = Math.hypot(vx, vy, vz);
  if (dist < 1e-5 || dist > maxRange) return 0;

  const invD = 1 / dist;
  const dirToPointX = vx * invD;
  const dirToPointY = vy * invD;
  const dirToPointZ = vz * invD;

  const cosTheta =
    dirToPointX * spotDir.x +
    dirToPointY * spotDir.y +
    dirToPointZ * spotDir.z;
  const coneFactor = smoothstep(cosOuter, cosInner, cosTheta);
  if (coneFactor <= 0) return 0;

  const distFactor = Math.pow(clamp(1 - dist / maxRange, 0, 1), 1.35);

  const nLen = Math.hypot(normal.x, normal.y, normal.z) || 1;
  const nDotL =
    (normal.x / nLen) * -dirToPointX +
    (normal.y / nLen) * -dirToPointY +
    (normal.z / nLen) * -dirToPointZ;
  const diffuse = clamp(nDotL * 0.85 + 0.25, 0.12, 1);

  return clamp(coneFactor * distFactor * diffuse, 0, 1);
}
