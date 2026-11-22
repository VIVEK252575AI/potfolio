"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  computeSpotlightRig,
  evaluateSpotlightIllumination,
} from "@/utils/spotlight3d";
import {
  createPacedRenderLoop,
  detectSoftwareWebGL,
} from "@/utils/webglSupport";

interface ArchitectureRing3DProps {
  className?: string;
}

const _dummy = new THREE.Object3D();

export default function ArchitectureRing3D({
  className = "",
}: ArchitectureRing3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const visibleRef = useRef(true);
  const scrollProgressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, active: 0, hasMoved: false });
  const pointerSmoothRef = useRef({ x: 0, y: 0, active: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const w = Math.max(360, mount.clientWidth || 1200);
    const h = Math.max(360, mount.clientHeight || 520);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080a0f, 0.052);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 60);
    camera.position.set(0, 1.35, 9.5);
    camera.lookAt(0, 0, 0);

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
    renderer.setSize(w, h, false);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.42;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0x38bdf8, 0x080a0f, 0.35);
    scene.add(hemi);
    const dirLight = new THREE.DirectionalLight(0xf59e0b, 0.48);
    dirLight.position.set(6, 6, 4);
    scene.add(dirLight);

    // Mouse-following spotlight sweeping the orbital rings and horizon dot field
    const cursorSpot = new THREE.SpotLight(
      0xffe9bf,
      68,
      26,
      Math.PI / 5.4,
      0.72,
      1.15
    );
    cursorSpot.position.set(0, 2.5, 6.2);
    scene.add(cursorSpot);
    scene.add(cursorSpot.target);

    // Composite large orbital accelerator rig
    const rigGroup = new THREE.Group();
    rigGroup.position.set(0, -0.1, -1.6);
    scene.add(rigGroup);

    const brushedTitanium = new THREE.MeshStandardMaterial({
      color: 0x1a2232,
      metalness: 0.9,
      roughness: 0.28,
    });
    const amberAlloy = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.18,
    });
    const pulseMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.1,
      roughness: 0.2,
    });

    const ring1Geo = new THREE.TorusGeometry(4.6, 0.06, 10, 64);
    const ring1 = new THREE.Mesh(ring1Geo, brushedTitanium);
    ring1.rotation.x = Math.PI * 0.42;
    rigGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.65, 0.045, 10, 60);
    const ring2 = new THREE.Mesh(ring2Geo, amberAlloy);
    ring2.rotation.set(Math.PI * 0.56, 0.25, 0);
    rigGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(5.6, 0.025, 8, 64);
    const ring3 = new THREE.Mesh(ring3Geo, brushedTitanium);
    ring3.rotation.set(Math.PI * 0.36, -0.22, 0.15);
    rigGroup.add(ring3);

    const pulseGeo = new THREE.BoxGeometry(0.16, 0.08, 0.36);
    const pulseCount = 18;
    const pulses = new THREE.InstancedMesh(pulseGeo, pulseMat, pulseCount);
    pulses.frustumCulled = false;
    rigGroup.add(pulses);

    // Sweeping topographic 3D dot horizon plane with spotlight vertex colors
    const cols = 32;
    const rows = 14;
    const gridCount = cols * rows;
    const gridPos = new Float32Array(gridCount * 3);
    const gridCol = new Float32Array(gridCount * 3);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 3;
        gridPos[idx] = (c - cols / 2) * 0.42;
        gridPos[idx + 1] = -2.25;
        gridPos[idx + 2] = (r - rows / 2) * 0.42;

        gridCol[idx] = 0.25;
        gridCol[idx + 1] = 0.32;
        gridCol[idx + 2] = 0.42;
      }
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.BufferAttribute(gridPos, 3));
    gridGeo.setAttribute("color", new THREE.BufferAttribute(gridCol, 3));
    const gridMat = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    const gridPoints = new THREE.Points(gridGeo, gridMat);
    scene.add(gridPoints);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const updateScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      scrollProgressRef.current = Math.max(
        0,
        Math.min(1, (vh - rect.top) / (vh + rect.height))
      );
    };
    updateScroll();

    const onPointerMove = (e: PointerEvent) => {
      const nx = Math.max(-1, Math.min(1, (e.clientX / (window.innerWidth || 1440)) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, -(e.clientY / (window.innerHeight || 900)) * 2 + 1));
      if (!pointerRef.current.hasMoved) {
        pointerSmoothRef.current.x = nx;
        pointerSmoothRef.current.y = ny;
        pointerSmoothRef.current.active = 1;
        pointerRef.current.hasMoved = true;
      }
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
      pointerRef.current.active = 1;
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      const nw = Math.max(360, mount.clientWidth || 1200);
      const nh = Math.max(360, mount.clientHeight || 520);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    });
    ro.observe(mount);

    const upNormal = { x: 0, y: 1, z: 0 };

    const stopLoop = createPacedRenderLoop(
      renderer,
      isSoftwareGl,
      (dt, elapsed) => {
        const s = scrollProgressRef.current;
        const p = pointerRef.current;
        const ps = pointerSmoothRef.current;

        const beamDamp = prefersReduced ? 12 : isSoftwareGl ? 24 : 14;
        ps.x = THREE.MathUtils.damp(ps.x, p.x, beamDamp, dt);
        ps.y = THREE.MathUtils.damp(ps.y, p.y, beamDamp, dt);
        ps.active = THREE.MathUtils.damp(
          ps.active,
          p.active,
          isSoftwareGl ? 24 : 10,
          dt
        );

        const idleX = prefersReduced ? 0.2 : Math.sin(elapsed * 0.4) * 0.45;
        const idleY = prefersReduced ? 0.1 : Math.cos(elapsed * 0.3) * 0.25;
        const spotNx = p.hasMoved ? THREE.MathUtils.lerp(idleX, ps.x, ps.active) : idleX;
        const spotNy = p.hasMoved ? THREE.MathUtils.lerp(idleY, ps.y, ps.active) : idleY;

        const rig = computeSpotlightRig(spotNx, spotNy, {
          originSpreadX: 6.2,
          originSpreadY: 3.8,
          originZ: 6.4,
          targetSpreadX: 4.5,
          targetSpreadY: 2.2,
          targetZ: -1.4,
        });

        cursorSpot.position.set(rig.origin.x, rig.origin.y + 1.4, rig.origin.z);
        cursorSpot.target.position.set(
          rig.target.x,
          rig.target.y - 0.6,
          rig.target.z
        );
        cursorSpot.target.updateMatrixWorld();

        container.dataset.spotX = rig.target.x.toFixed(3);
        container.dataset.spotY = rig.target.y.toFixed(3);

        const targetY = ps.x * 0.28 + s * 1.1;
        const targetX = -ps.y * 0.14 + (s - 0.5) * 0.35;

        rigGroup.rotation.y = THREE.MathUtils.damp(
          rigGroup.rotation.y,
          targetY,
          4.5,
          dt
        );
        rigGroup.rotation.x = THREE.MathUtils.damp(
          rigGroup.rotation.x,
          targetX,
          4.5,
          dt
        );

        if (!prefersReduced) {
          ring1.rotation.z = elapsed * 0.18 + s * 1.2;
          ring2.rotation.z = -elapsed * 0.25 - s * 1.6;
          ring3.rotation.z = elapsed * 0.11;

          for (let i = 0; i < pulseCount; i++) {
            const ang =
              (i / pulseCount) * Math.PI * 2 + elapsed * 0.45 + s * 2.0;
            const rad = i % 2 === 0 ? 4.6 : 3.65;
            const yTilt = Math.sin(ang) * (i % 2 === 0 ? 1.1 : 1.5);
            _dummy.position.set(Math.cos(ang) * rad, yTilt, Math.sin(ang) * rad);
            _dummy.rotation.set(0, -ang, 0);
            _dummy.scale.setScalar(1);
            _dummy.updateMatrix();
            pulses.setMatrixAt(i, _dummy.matrix);
          }
          pulses.instanceMatrix.needsUpdate = true;

          const posAttr = gridGeo.attributes.position as THREE.BufferAttribute;
          const colAttr = gridGeo.attributes.color as THREE.BufferAttribute;
          const gRig = computeSpotlightRig(spotNx, spotNy, {
            originSpreadX: 5.8,
            originSpreadY: 3.5,
            originZ: 4.0,
            targetSpreadX: 5.5,
            targetSpreadY: 2.2,
            targetZ: -0.5,
          });
          for (let i = 0; i < gridCount; i++) {
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);
            const y =
              -2.25 +
              Math.sin(x * 0.48 + elapsed * 0.8 + s * 3.0) * 0.26 +
              Math.cos(z * 0.55 - elapsed * 0.6) * 0.2;
            posAttr.setY(i, y);

            const illum = evaluateSpotlightIllumination(
              { x, y, z },
              upNormal,
              { x: gRig.origin.x, y: 2.2, z: 3.5 },
              {
                x: gRig.direction.x,
                y: -0.78,
                z: gRig.direction.z,
              },
              0.55,
              0.92,
              15
            );
            colAttr.setXYZ(
              i,
              0.2 + illum * 0.78,
              0.28 + illum * 0.44,
              0.38 - illum * 0.14
            );
          }
          posAttr.needsUpdate = true;
          colAttr.needsUpdate = true;
        }

        renderer.render(scene, camera);
      },
      () => !visibleRef.current
    );

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", onPointerMove);

      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      pulseGeo.dispose();
      gridGeo.dispose();
      brushedTitanium.dispose();
      amberAlloy.dispose();
      pulseMat.dispose();
      gridMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="architecture-3d-bg"
      data-spot-x="0.000"
      data-spot-y="0.000"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
