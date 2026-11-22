"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  buildPortraitPointCloud,
  removeStudioBackground,
} from "@/utils/portrait3d";
import { computeSpotlightRig } from "@/utils/spotlight3d";
import {
  createPacedRenderLoop,
  detectSoftwareWebGL,
} from "@/utils/webglSupport";

interface HeroPortrait3DProps {
  src: string;
  alt: string;
  className?: string;
}

const VERTEX_SHADER = `
  attribute float aSize;
  attribute float aSeed;
  attribute float aRim;
  attribute vec3 aColor;
  attribute vec3 aNormal;

  uniform float uTime;
  uniform float uPointBaseSize;
  uniform float uScroll;
  uniform float uDisperse;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform vec3 uSpotOrigin;
  uniform vec3 uSpotDir;
  uniform float uSpotStrength;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vRim;
  varying float vSpot;
  varying float vSpec;

  void main() {
    vColor = aColor;
    vRim = aRim;

    vec3 pos = position;

    // Gentle volumetric breathing & diagonal studio light shimmer
    float wave = sin(pos.x * 2.2 + pos.y * 1.6 - uTime * 1.15) * 0.035;
    pos.z += wave * (0.4 + aRim * 0.8);

    // Gentle pointer depth lens & micro-shimmer without tearing facial features
    vec2 toCursor = pos.xy - uPointer * vec2(1.9, 1.9);
    float dist = length(toCursor);
    float influence = exp(-dist * dist * 1.9) * uPointerActive;
    vec2 pushDir = dist > 0.001 ? toCursor / dist : vec2(0.0, 1.0);
    pos.xy += pushDir * influence * (0.025 + aSeed * 0.025);
    pos.z += influence * 0.28;

    // Scroll-coupled volumetric expansion & outward particle drift
    float angle = aSeed * 6.2831853 + pos.y * 1.1;
    vec3 driftDir = vec3(cos(angle) * 0.85, sin(angle) * 0.45 + 0.35, (aSeed - 0.3) * 1.4);
    pos += driftDir * uDisperse * (0.55 + aRim * 0.85);
    pos.z *= 1.0 + uScroll * 0.45;

    vec4 worldPos4 = modelMatrix * vec4(pos, 1.0);
    vec3 worldPos = worldPos4.xyz;
    vec3 worldNormal = normalize(mat3(modelMatrix) * aNormal);

    // 3D volumetric mouse-following spotlight illumination (cone + normal + specular)
    vec3 spotToPoint = worldPos - uSpotOrigin;
    float spotDist = length(spotToPoint);
    vec3 spotRay = spotDist > 0.001 ? spotToPoint / spotDist : vec3(0.0, 0.0, -1.0);
    float cosTheta = dot(spotRay, normalize(uSpotDir));
    float cone = smoothstep(0.80, 0.975, cosTheta);
    float rangeAtten = pow(clamp(1.0 - spotDist / 9.8, 0.0, 1.0), 1.15);

    vec3 lightDir = -spotRay;
    float ndotl = max(0.0, dot(worldNormal, lightDir));
    float wrapDiffuse = clamp(ndotl * 0.82 + 0.24, 0.0, 1.0);

    vec3 viewDir = normalize(cameraPosition - worldPos);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(0.0, dot(worldNormal, halfVec)), 22.0);

    float spotMask = cone * rangeAtten * uSpotStrength;
    vSpot = clamp(spotMask * wrapDiffuse, 0.0, 1.5);
    vSpec = clamp(spotMask * spec * 1.25, 0.0, 1.0);

    vec4 mvPosition = viewMatrix * worldPos4;
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(7.2 / max(1.0, -mvPosition.z), 0.55, 1.9);
    gl_PointSize = aSize * uPointBaseSize * depthScale * (1.0 + vSpot * 0.28);

    // Subtle halftone diagonal sweep brightening + spotlight punch
    float diagBand = 0.88 + 0.12 * sin((pos.x - pos.y) * 9.0 + uTime * 0.9);
    float baseAlpha = (0.68 - uDisperse * 0.42) * diagBand;
    vAlpha = clamp(baseAlpha + vSpot * 0.32, 0.08, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vRim;
  varying float vSpot;
  varying float vSpec;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Crisp halftone disc with sculptural chiaroscuro + warm mouse spotlight
    float core = smoothstep(0.5, 0.14, dist);
    vec3 amberTint = vec3(0.98, 0.64, 0.14);
    vec3 ivorySpot = vec3(1.0, 0.94, 0.82);

    // Dim unlit periphery so spotlighted regions pop with unmistakable 3D depth
    vec3 shadowedBase = vColor * mix(0.42, 1.48, clamp(vSpot, 0.0, 1.0));
    vec3 warmLit = mix(shadowedBase, max(shadowedBase, amberTint), vRim * 0.35 * (1.0 - core) + vSpot * 0.26);
    vec3 finalColor = min(vec3(1.0), warmLit + ivorySpot * (vSpec * 0.65 + vSpot * 0.2));

    gl_FragColor = vec4(finalColor, core * vAlpha);
  }
`;

export default function HeroPortrait3D({
  src,
  alt,
  className = "",
}: HeroPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const pointerTargetRef = useRef({ x: 0, y: 0, active: 0, hasMoved: false });
  const pointerCurrentRef = useRef({ x: 0, y: 0, active: 0 });
  const scrollProgressRef = useRef(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    let cancelled = false;
    const isSoftwareGl = detectSoftwareWebGL();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const width = Math.max(280, mount.clientWidth || 680);
    const height = Math.max(280, mount.clientHeight || 540);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0, 0.08, 7.1);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(width, height, false);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    // Physical lighting for orbital rings so they catch the mouse spotlight too
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090b10, 0.38);
    scene.add(hemiLight);

    const ringSpot = new THREE.SpotLight(0xffe6b8, 28, 16, Math.PI / 5.5, 0.72, 1.25);
    ringSpot.position.set(0, 0.5, 4.2);
    scene.add(ringSpot);
    scene.add(ringSpot.target);

    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Subtle 3D orbital halo rings framing the portrait volume
    const ringMatA = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.25,
      metalness: 0.88,
      roughness: 0.22,
      transparent: true,
      opacity: 0.62,
    });
    const ringGeoA = new THREE.TorusGeometry(2.45, 0.015, 10, 96);
    const ringMeshA = new THREE.Mesh(ringGeoA, ringMatA);
    ringMeshA.rotation.set(Math.PI * 0.42, -0.25, 0.1);
    ringMeshA.position.set(0, 0.08, -0.45);
    sculptureGroup.add(ringMeshA);

    const ringMatB = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.22,
      metalness: 0.85,
      roughness: 0.26,
      transparent: true,
      opacity: 0.44,
    });
    const ringGeoB = new THREE.TorusGeometry(2.8, 0.012, 10, 96);
    const ringMeshB = new THREE.Mesh(ringGeoB, ringMatB);
    ringMeshB.rotation.set(Math.PI * 0.56, 0.3, -0.18);
    ringMeshB.position.set(0, -0.05, -0.65);
    sculptureGroup.add(ringMeshB);

    let portraitGeo: THREE.BufferGeometry | null = null;
    let portraitMat: THREE.ShaderMaterial | null = null;
    let portraitPoints: THREE.Points | null = null;

    const uniforms = {
      uTime: { value: 0 },
      uPointBaseSize: { value: Math.max(2.6, Math.min(4.6, width / 145)) },
      uScroll: { value: 0 },
      uDisperse: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerActive: { value: 0 },
      uSpotOrigin: { value: new THREE.Vector3(0.4, 0.6, 4.2) },
      uSpotDir: { value: new THREE.Vector3(-0.08, -0.1, -0.99) },
      uSpotStrength: { value: 0.95 },
    };

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (cancelled) return;

      const sampleSize = 168;
      const offCanvas = document.createElement("canvas");
      offCanvas.width = sampleSize;
      offCanvas.height = sampleSize;
      const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.clearRect(0, 0, sampleSize, sampleSize);
      offCtx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const rawData = offCtx.getImageData(0, 0, sampleSize, sampleSize);
      const cleanPixels = removeStudioBackground(
        rawData.data,
        sampleSize,
        sampleSize
      );

      const cloud = buildPortraitPointCloud(cleanPixels, sampleSize, sampleSize, {
        step: 2,
        widthUnits: 4.15,
        heightUnits: 4.15,
        depthUnits: 1.55,
        alphaThreshold: 40,
      });

      portraitGeo = new THREE.BufferGeometry();
      portraitGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(cloud.positions, 3)
      );
      portraitGeo.setAttribute(
        "aNormal",
        new THREE.BufferAttribute(cloud.normals, 3)
      );
      portraitGeo.setAttribute(
        "aColor",
        new THREE.BufferAttribute(cloud.colors, 3)
      );
      portraitGeo.setAttribute(
        "aSize",
        new THREE.BufferAttribute(cloud.sizes, 1)
      );
      portraitGeo.setAttribute(
        "aSeed",
        new THREE.BufferAttribute(cloud.seeds, 1)
      );
      portraitGeo.setAttribute(
        "aRim",
        new THREE.BufferAttribute(cloud.rimWeights, 1)
      );

      portraitMat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      portraitPoints = new THREE.Points(portraitGeo, portraitMat);
      portraitPoints.position.set(0, -0.02, 0.15);
      sculptureGroup.add(portraitPoints);

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }
      setReady(true);
    };

    const updateScroll = () => {
      const heroHeight = Math.max(window.innerHeight, 600);
      const progress = Math.max(0, Math.min(1, window.scrollY / heroHeight));
      scrollProgressRef.current = progress;
      container.dataset.scrollProgress = progress.toFixed(3);
    };
    updateScroll();

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = Math.max(-1.2, Math.min(1.2, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1.2, Math.min(1.2, -(((e.clientY - rect.top) / rect.height) * 2 - 1)));
      if (!pointerTargetRef.current.hasMoved) {
        pointerCurrentRef.current.x = nx;
        pointerCurrentRef.current.y = ny;
        pointerCurrentRef.current.active = 1;
        pointerTargetRef.current.hasMoved = true;
      }
      pointerTargetRef.current.x = nx;
      pointerTargetRef.current.y = ny;
      pointerTargetRef.current.active = 1;
    };

    const onPointerLeave = () => {
      pointerTargetRef.current.active = 0;
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      const w = Math.max(280, mount.clientWidth || 680);
      const h = Math.max(280, mount.clientHeight || 540);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      uniforms.uPointBaseSize.value = Math.max(2.6, Math.min(4.6, w / 145));
    });
    ro.observe(mount);

    const stopLoop = createPacedRenderLoop(
      renderer,
      isSoftwareGl,
      (dt, elapsed) => {
        const ptrT = pointerTargetRef.current;
        const ptrC = pointerCurrentRef.current;
        const beamDamp = prefersReduced ? 12 : isSoftwareGl ? 24 : 15;

        ptrC.x = THREE.MathUtils.damp(ptrC.x, ptrT.x, beamDamp, dt);
        ptrC.y = THREE.MathUtils.damp(ptrC.y, ptrT.y, beamDamp, dt);
        ptrC.active = THREE.MathUtils.damp(
          ptrC.active,
          ptrT.active,
          isSoftwareGl ? 24 : 10,
          dt
        );

        const s = scrollProgressRef.current;
        uniforms.uTime.value = prefersReduced ? 0 : elapsed;
        uniforms.uScroll.value = THREE.MathUtils.damp(
          uniforms.uScroll.value,
          s,
          6,
          dt
        );
        uniforms.uDisperse.value = THREE.MathUtils.damp(
          uniforms.uDisperse.value,
          Math.max(0, (s - 0.08) * 1.4),
          5.5,
          dt
        );
        uniforms.uPointer.value.set(ptrC.x, ptrC.y);
        uniforms.uPointerActive.value = ptrC.active;

        // Track cursor directly once moved; fall back to gentle sweep before interaction
        const idleX = prefersReduced ? 0.25 : Math.sin(elapsed * 0.55) * 0.35;
        const idleY = prefersReduced ? 0.18 : Math.cos(elapsed * 0.42) * 0.22;
        const spotNx = ptrT.hasMoved
          ? THREE.MathUtils.lerp(idleX, ptrC.x, ptrC.active)
          : idleX;
        const spotNy = ptrT.hasMoved
          ? THREE.MathUtils.lerp(idleY, ptrC.y, ptrC.active)
          : idleY;

        const rig = computeSpotlightRig(spotNx, spotNy, {
          originSpreadX: 3.1,
          originSpreadY: 2.35,
          originZ: 4.15,
          targetSpreadX: 1.85,
          targetSpreadY: 1.55,
          targetZ: 0.15,
        });

        uniforms.uSpotOrigin.value.set(rig.origin.x, rig.origin.y, rig.origin.z);
        uniforms.uSpotDir.value.set(
          rig.direction.x,
          rig.direction.y,
          rig.direction.z
        );
        uniforms.uSpotStrength.value = 0.9 + ptrC.active * 0.45;

        ringSpot.position.set(rig.origin.x, rig.origin.y, rig.origin.z);
        ringSpot.target.position.set(rig.target.x, rig.target.y, rig.target.z);
        ringSpot.target.updateMatrixWorld();

        container.dataset.spotX = rig.target.x.toFixed(3);
        container.dataset.spotY = rig.target.y.toFixed(3);

        const targetRotY =
          ptrC.x * 0.34 +
          s * 0.55 +
          (prefersReduced ? 0 : Math.sin(elapsed * 0.42) * 0.055);
        const targetRotX = -ptrC.y * 0.2 - s * 0.14;
        sculptureGroup.rotation.y = THREE.MathUtils.damp(
          sculptureGroup.rotation.y,
          targetRotY,
          5.5,
          dt
        );
        sculptureGroup.rotation.x = THREE.MathUtils.damp(
          sculptureGroup.rotation.x,
          targetRotX,
          5.5,
          dt
        );
        sculptureGroup.position.y = THREE.MathUtils.damp(
          sculptureGroup.position.y,
          s * 0.35,
          5,
          dt
        );

        ringMeshA.rotation.z += dt * 0.18 * (1 + s * 1.5);
        ringMeshB.rotation.z -= dt * 0.13 * (1 + s * 1.5);

        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          7.1 - s * 1.15,
          4.5,
          dt
        );

        renderer.render(scene, camera);
      },
      () => !visibleRef.current
    );

    return () => {
      cancelled = true;
      stopLoop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);

      if (portraitPoints) sculptureGroup.remove(portraitPoints);
      portraitGeo?.dispose();
      portraitMat?.dispose();
      ringGeoA.dispose();
      ringMatA.dispose();
      ringGeoB.dispose();
      ringMatB.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      data-testid="hero-portrait-3d"
      data-model-ready={ready ? "true" : "false"}
      data-scroll-progress="0.000"
      data-spot-x="0.000"
      data-spot-y="0.000"
      role="img"
      aria-label={`${alt} interactive 3D volumetric particle model`}
      className={`relative select-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] ${className}`}
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
