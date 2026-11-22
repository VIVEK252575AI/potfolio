"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { CanvasMode } from "@/components/motion/ParticleCanvas";
import { computeSpotlightRig } from "@/utils/spotlight3d";
import {
  createPacedRenderLoop,
  detectSoftwareWebGL,
} from "@/utils/webglSupport";

interface AboutModel3DProps {
  mode: CanvasMode;
  className?: string;
}

const _dummy = new THREE.Object3D();
const _vA = new THREE.Vector3();

function createProceduralSurfaceMap(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 2) {
      const shade = 116 + Math.round(Math.sin(y * 0.35) * 18);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, size, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.needsUpdate = true;
  return tex;
}

export default function AboutModel3D({
  mode,
  className = "",
}: AboutModel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const modeRef = useRef<CanvasMode>(mode);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    active: 0,
    hasMoved: false,
    dragX: 0,
    dragY: 0,
    dragging: false,
  });
  const visibleRef = useRef(true);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const w = Math.max(320, mount.clientWidth || 560);
    const h = Math.max(340, mount.clientHeight || 500);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.045);

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 60);
    camera.position.set(0, 0.55, 8.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(w, h, false);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.42;
    pmremGenerator.dispose();

    // Subdued base studio fill so the mouse-following SpotLight creates dramatic depth
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x07090f, 0.32);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfde68a, 0.42);
    keyLight.position.set(-4.5, 5.5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // Interactive cursor-following PBR SpotLight (single shadow caster on GPU)
    const cursorSpot = new THREE.SpotLight(
      0xfff1d0,
      74,
      22,
      Math.PI / 6.6,
      0.68,
      1.15
    );
    cursorSpot.position.set(2.2, 1.8, 5.6);
    cursorSpot.castShadow = !isSoftwareGl;
    cursorSpot.shadow.mapSize.set(1024, 1024);
    cursorSpot.shadow.camera.near = 1.2;
    cursorSpot.shadow.camera.far = 16;
    cursorSpot.shadow.bias = -0.0005;
    cursorSpot.shadow.normalBias = 0.02;
    scene.add(cursorSpot);
    scene.add(cursorSpot.target);

    const bumpTex = createProceduralSurfaceMap();
    bumpTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Shared PBR material library with clear roughness/metalness contrast
    const titaniumDarkMat = new THREE.MeshStandardMaterial({
      color: 0x161b26,
      metalness: 0.88,
      roughness: 0.4,
      bumpMap: bumpTex,
      bumpScale: 0.015,
    });
    const matteCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x0e1118,
      metalness: 0.18,
      roughness: 0.78,
    });
    const brushedAmberMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.94,
      roughness: 0.18,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      anisotropy: 0.75,
    });
    const cyanEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.85,
      metalness: 0.45,
      roughness: 0.2,
    });
    const wireframeAuraMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });

    // Ground contact shadow disc (y = -2.45)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 4, 64, 64, 62);
      grad.addColorStop(0, "rgba(0,0,0,0.78)");
      grad.addColorStop(0.55, "rgba(245,158,11,0.12)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.CircleGeometry(2.85, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -2.45;
    scene.add(contactShadow);

    // Subtle floor spotlight glow pool tracking cursor beam (+0.025 Y above shadow to avoid Z-fighting)
    const poolCanvas = document.createElement("canvas");
    poolCanvas.width = 128;
    poolCanvas.height = 128;
    const pCtx = poolCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(64, 64, 2, 64, 64, 62);
      grad.addColorStop(0, "rgba(255, 226, 168, 0.36)");
      grad.addColorStop(0.42, "rgba(245, 158, 11, 0.14)");
      grad.addColorStop(1, "rgba(245, 158, 11, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 128, 128);
    }
    const poolTex = new THREE.CanvasTexture(poolCanvas);
    poolTex.colorSpace = THREE.SRGBColorSpace;
    const poolGeo = new THREE.CircleGeometry(1.85, 32);
    const poolMat = new THREE.MeshBasicMaterial({
      map: poolTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.72,
    });
    const spotPool = new THREE.Mesh(poolGeo, poolMat);
    spotPool.rotation.x = -Math.PI / 2;
    spotPool.position.set(0, -2.425, 0);
    scene.add(spotPool);

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const geometriesToDispose: THREE.BufferGeometry[] = [shadowGeo, poolGeo];

    // ─── MODEL 1: Neural Tensor Core ("ai") ──────────────────────────────────
    const aiGroup = new THREE.Group();
    const coreIcoGeo = new THREE.IcosahedronGeometry(0.95, 1);
    const coreIco = new THREE.Mesh(coreIcoGeo, brushedAmberMat);
    coreIco.castShadow = !isSoftwareGl;
    coreIco.receiveShadow = !isSoftwareGl;
    aiGroup.add(coreIco);

    const coreShellGeo = new THREE.IcosahedronGeometry(1.18, 1);
    const coreShell = new THREE.Mesh(coreShellGeo, wireframeAuraMat);
    aiGroup.add(coreShell);

    const ringAGeo = new THREE.TorusGeometry(1.75, 0.085, 20, 72);
    const ringA = new THREE.Mesh(ringAGeo, titaniumDarkMat);
    ringA.castShadow = !isSoftwareGl;
    ringA.receiveShadow = !isSoftwareGl;
    ringA.rotation.x = Math.PI * 0.25;
    aiGroup.add(ringA);

    const ringBGeo = new THREE.TorusGeometry(2.22, 0.065, 20, 84);
    const ringB = new THREE.Mesh(ringBGeo, brushedAmberMat);
    ringB.receiveShadow = !isSoftwareGl;
    ringB.rotation.y = Math.PI * 0.35;
    aiGroup.add(ringB);

    const ringCGeo = new THREE.TorusGeometry(2.65, 0.035, 16, 96);
    const ringC = new THREE.Mesh(ringCGeo, matteCarbonMat);
    ringC.receiveShadow = !isSoftwareGl;
    ringC.rotation.set(-Math.PI * 0.3, Math.PI * 0.2, 0);
    aiGroup.add(ringC);

    const clampGeo = new THREE.BoxGeometry(0.24, 0.24, 0.34);
    for (let k = 0; k < 4; k++) {
      const ang = (k / 4) * Math.PI * 2;
      const clampMesh = new THREE.Mesh(clampGeo, cyanEmissiveMat);
      clampMesh.position.set(Math.cos(ang) * 2.22, Math.sin(ang) * 2.22, 0);
      clampMesh.rotation.z = ang;
      ringB.add(clampMesh);
    }

    const synapseGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const synapseCount = 36;
    const synapses = new THREE.InstancedMesh(
      synapseGeo,
      cyanEmissiveMat,
      synapseCount
    );
    synapses.frustumCulled = false;
    aiGroup.add(synapses);

    geometriesToDispose.push(
      coreIcoGeo,
      coreShellGeo,
      ringAGeo,
      ringBGeo,
      ringCGeo,
      clampGeo,
      synapseGeo
    );
    stageGroup.add(aiGroup);

    // ─── MODEL 2: Layered Distributed Stack ("fullstack") ─────────────────────
    const fsGroup = new THREE.Group();
    const hexShape = new THREE.Shape();
    for (let s = 0; s < 6; s++) {
      const a = (s / 6) * Math.PI * 2;
      const rx = Math.cos(a) * 1.95;
      const ry = Math.sin(a) * 1.95;
      if (s === 0) hexShape.moveTo(rx, ry);
      else hexShape.lineTo(rx, ry);
    }
    hexShape.closePath();

    const deckGeo = new THREE.ExtrudeGeometry(hexShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    });
    deckGeo.rotateX(Math.PI / 2);
    deckGeo.center();

    const fsDecks: THREE.Mesh[] = [];
    for (let d = 0; d < 4; d++) {
      const mat = d % 2 === 0 ? titaniumDarkMat : matteCarbonMat;
      const deck = new THREE.Mesh(deckGeo, mat);
      deck.position.y = (d - 1.5) * 0.85;
      deck.scale.setScalar(1 - d * 0.08);
      deck.castShadow = !isSoftwareGl;
      deck.receiveShadow = !isSoftwareGl;
      fsGroup.add(deck);
      fsDecks.push(deck);
    }

    const spineGeo = new THREE.CylinderGeometry(0.22, 0.28, 3.6, 20);
    const spine = new THREE.Mesh(spineGeo, brushedAmberMat);
    spine.receiveShadow = !isSoftwareGl;
    fsGroup.add(spine);

    const busRingGeo = new THREE.TorusGeometry(2.35, 0.04, 14, 72);
    const busRing = new THREE.Mesh(busRingGeo, cyanEmissiveMat);
    busRing.rotation.x = Math.PI / 2;
    fsGroup.add(busRing);

    const packetGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const packetCount = 24;
    const packets = new THREE.InstancedMesh(
      packetGeo,
      brushedAmberMat,
      packetCount
    );
    packets.frustumCulled = false;
    fsGroup.add(packets);

    geometriesToDispose.push(deckGeo, spineGeo, busRingGeo, packetGeo);
    stageGroup.add(fsGroup);

    // ─── MODEL 3: Geodesic Graph Matrix ("dsa") ─────────────────────────────
    const dsaGroup = new THREE.Group();
    const lathePts = [
      new THREE.Vector2(0.0, -0.9),
      new THREE.Vector2(0.55, -0.55),
      new THREE.Vector2(0.32, 0.0),
      new THREE.Vector2(0.62, 0.55),
      new THREE.Vector2(0.0, 0.95),
    ];
    const hubGeo = new THREE.LatheGeometry(lathePts, 24);
    const dsaHub = new THREE.Mesh(hubGeo, brushedAmberMat);
    dsaHub.castShadow = !isSoftwareGl;
    dsaHub.receiveShadow = !isSoftwareGl;
    dsaGroup.add(dsaHub);

    const cageGeo = new THREE.DodecahedronGeometry(2.15, 0);
    const cageEdgesGeo = new THREE.EdgesGeometry(cageGeo, 1);
    const cageLines = new THREE.LineSegments(
      cageEdgesGeo,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
      })
    );
    dsaGroup.add(cageLines);

    const nodeGeo = new THREE.OctahedronGeometry(0.17, 0);
    const dodecaVerts = cageGeo.attributes.position;
    const seen = new Set<string>();
    const uniqueVerts: THREE.Vector3[] = [];
    for (let i = 0; i < dodecaVerts.count; i++) {
      const vx = dodecaVerts.getX(i);
      const vy = dodecaVerts.getY(i);
      const vz = dodecaVerts.getZ(i);
      const key = `${vx.toFixed(2)},${vy.toFixed(2)},${vz.toFixed(2)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueVerts.push(new THREE.Vector3(vx, vy, vz));
      }
    }
    const graphNodes = new THREE.InstancedMesh(
      nodeGeo,
      titaniumDarkMat,
      uniqueVerts.length
    );
    uniqueVerts.forEach((v, idx) => {
      _dummy.position.copy(v);
      _dummy.scale.setScalar(1);
      _dummy.rotation.set(0, idx * 0.4, 0);
      _dummy.updateMatrix();
      graphNodes.setMatrixAt(idx, _dummy.matrix);
    });
    graphNodes.instanceMatrix.needsUpdate = true;
    graphNodes.computeBoundingSphere();
    dsaGroup.add(graphNodes);

    const probeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const probeCount = 24;
    const probes = new THREE.InstancedMesh(probeGeo, brushedAmberMat, probeCount);
    probes.frustumCulled = false;
    dsaGroup.add(probes);

    geometriesToDispose.push(hubGeo, cageGeo, cageEdgesGeo, nodeGeo, probeGeo);
    stageGroup.add(dsaGroup);

    // Ambient orbital starfield particles around the large 3D model
    const starCount = 240;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.1 + Math.random() * 2.2;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    stageGroup.add(stars);
    geometriesToDispose.push(starGeo);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const scaleState = { ai: 1, fullstack: 0.001, dsa: 0.001 };
    const pointerSmooth = { x: 0, y: 0, active: 0 };

    const updateScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight || 900;
      const progress = Math.max(
        0,
        Math.min(1, (viewH - rect.top) / (viewH + rect.height))
      );
      scrollProgressRef.current = progress;
    };
    updateScroll();

    const onPointerMove = (e: PointerEvent) => {
      if (!visibleRef.current) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = Math.max(-1.15, Math.min(1.15, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1.15, Math.min(1.15, -(((e.clientY - rect.top) / rect.height) * 2 - 1)));
      if (pointerRef.current.dragging) {
        pointerRef.current.dragX += e.movementX * 0.012;
        pointerRef.current.dragY += e.movementY * 0.012;
      }
      if (!pointerRef.current.hasMoved) {
        pointerSmooth.x = nx;
        pointerSmooth.y = ny;
        pointerSmooth.active = 1;
        pointerRef.current.hasMoved = true;
      }
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
      pointerRef.current.active = 1;
    };

    const onPointerDown = () => {
      pointerRef.current.dragging = true;
    };
    const onPointerUp = () => {
      pointerRef.current.dragging = false;
    };
    const onMouseLeaveDoc = () => {
      pointerRef.current.active = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("mouseleave", onMouseLeaveDoc);
    window.addEventListener("scroll", updateScroll, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      const nw = Math.max(320, mount.clientWidth || 560);
      const nh = Math.max(340, mount.clientHeight || 500);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    });
    ro.observe(mount);

    const stopLoop = createPacedRenderLoop(
      renderer,
      isSoftwareGl,
      (dt, elapsed) => {
        const activeMode = modeRef.current;
        const s = scrollProgressRef.current;

        scaleState.ai = THREE.MathUtils.damp(
          scaleState.ai,
          activeMode === "ai" ? 1 : 0.001,
          8,
          dt
        );
        scaleState.fullstack = THREE.MathUtils.damp(
          scaleState.fullstack,
          activeMode === "fullstack" ? 1 : 0.001,
          8,
          dt
        );
        scaleState.dsa = THREE.MathUtils.damp(
          scaleState.dsa,
          activeMode === "dsa" ? 1 : 0.001,
          8,
          dt
        );

        aiGroup.visible = scaleState.ai > 0.015;
        fsGroup.visible = scaleState.fullstack > 0.015;
        dsaGroup.visible = scaleState.dsa > 0.015;

        aiGroup.scale.setScalar(scaleState.ai);
        fsGroup.scale.setScalar(scaleState.fullstack);
        dsaGroup.scale.setScalar(scaleState.dsa);

        const beamDamp = prefersReduced ? 12 : isSoftwareGl ? 24 : 14;
        pointerSmooth.x = THREE.MathUtils.damp(
          pointerSmooth.x,
          pointerRef.current.x,
          beamDamp,
          dt
        );
        pointerSmooth.y = THREE.MathUtils.damp(
          pointerSmooth.y,
          pointerRef.current.y,
          beamDamp,
          dt
        );
        pointerSmooth.active = THREE.MathUtils.damp(
          pointerSmooth.active,
          pointerRef.current.active,
          isSoftwareGl ? 24 : 10,
          dt
        );

        // Smooth studio sweep when idle, locking crisply onto cursor when moved
        const idleX = prefersReduced ? 0.35 : Math.sin(elapsed * 0.52) * 0.48;
        const idleY = prefersReduced ? 0.25 : Math.cos(elapsed * 0.38) * 0.32;
        const spotNx = pointerRef.current.hasMoved
          ? THREE.MathUtils.lerp(idleX, pointerSmooth.x, pointerSmooth.active)
          : idleX;
        const spotNy = pointerRef.current.hasMoved
          ? THREE.MathUtils.lerp(idleY, pointerSmooth.y, pointerSmooth.active)
          : idleY;

        const rig = computeSpotlightRig(spotNx, spotNy, {
          originSpreadX: 4.5,
          originSpreadY: 3.4,
          originZ: 5.8,
          targetSpreadX: 2.35,
          targetSpreadY: 1.85,
          targetZ: 0.1,
        });

        cursorSpot.position.set(rig.origin.x, rig.origin.y, rig.origin.z);
        cursorSpot.target.position.set(rig.target.x, rig.target.y, rig.target.z);
        cursorSpot.target.updateMatrixWorld();

        spotPool.position.x = THREE.MathUtils.damp(
          spotPool.position.x,
          rig.target.x * 0.9,
          6.5,
          dt
        );
        spotPool.position.z = THREE.MathUtils.damp(
          spotPool.position.z,
          -rig.target.y * 0.35,
          6.5,
          dt
        );

        container.dataset.spotX = rig.target.x.toFixed(3);
        container.dataset.spotY = rig.target.y.toFixed(3);

        const targetStageY =
          pointerSmooth.x * 0.65 +
          pointerRef.current.dragX +
          s * Math.PI * 0.95 +
          (prefersReduced ? 0 : elapsed * 0.24);
        const targetStageX =
          -pointerSmooth.y * 0.35 + pointerRef.current.dragY + (s - 0.5) * 0.4;

        stageGroup.rotation.y = THREE.MathUtils.damp(
          stageGroup.rotation.y,
          targetStageY,
          5.5,
          dt
        );
        stageGroup.rotation.x = THREE.MathUtils.damp(
          stageGroup.rotation.x,
          targetStageX,
          5.5,
          dt
        );

        if (aiGroup.visible) {
          coreIco.rotation.y = elapsed * 0.45;
          coreShell.rotation.x = -elapsed * 0.25;
          ringA.rotation.z = elapsed * 0.55;
          ringB.rotation.x = elapsed * 0.42 + s * 1.4;
          ringC.rotation.y = -elapsed * 0.3;

          for (let i = 0; i < synapseCount; i++) {
            const ang = (i / synapseCount) * Math.PI * 2 + elapsed * 0.55;
            const orbit = i % 2 === 0 ? 1.75 : 2.22;
            const tilt =
              i % 2 === 0 ? Math.sin(ang) * 0.65 : Math.cos(ang) * 0.85;
            _dummy.position.set(
              Math.cos(ang) * orbit,
              tilt,
              Math.sin(ang) * orbit
            );
            _dummy.scale.setScalar(0.85 + 0.3 * Math.sin(elapsed * 2 + i));
            _dummy.updateMatrix();
            synapses.setMatrixAt(i, _dummy.matrix);
          }
          synapses.instanceMatrix.needsUpdate = true;
        }

        if (fsGroup.visible) {
          const explode =
            0.82 +
            Math.abs(s - 0.5) * 0.65 +
            Math.abs(pointerSmooth.y) * 0.25;
          fsDecks.forEach((deck, idx) => {
            deck.position.y = THREE.MathUtils.damp(
              deck.position.y,
              (idx - 1.5) * explode,
              6,
              dt
            );
            deck.rotation.y =
              elapsed * (0.18 + idx * 0.08) * (idx % 2 === 0 ? 1 : -1);
          });
          busRing.rotation.z = elapsed * 0.35;
          for (let i = 0; i < packetCount; i++) {
            const ang = (i / packetCount) * Math.PI * 2 + elapsed * 0.85;
            const yWave = Math.sin(ang * 2 + elapsed) * 1.35;
            _dummy.position.set(
              Math.cos(ang) * 2.35,
              yWave,
              Math.sin(ang) * 2.35
            );
            _dummy.rotation.set(elapsed + i, ang, 0);
            _dummy.scale.setScalar(1);
            _dummy.updateMatrix();
            packets.setMatrixAt(i, _dummy.matrix);
          }
          packets.instanceMatrix.needsUpdate = true;
        }

        if (dsaGroup.visible) {
          dsaHub.rotation.y = -elapsed * 0.5;
          cageLines.rotation.y = elapsed * 0.22;
          for (let i = 0; i < probeCount; i++) {
            const aIdx = i % uniqueVerts.length;
            const bIdx = (i + 3) % uniqueVerts.length;
            const t = (elapsed * 0.55 + i * 0.27) % 1;
            _vA.lerpVectors(uniqueVerts[aIdx], uniqueVerts[bIdx], t);
            _dummy.position.copy(_vA);
            _dummy.scale.setScalar(1 + 0.25 * Math.sin(t * Math.PI));
            _dummy.updateMatrix();
            probes.setMatrixAt(i, _dummy.matrix);
          }
          probes.instanceMatrix.needsUpdate = true;
        }

        stars.rotation.y = -elapsed * 0.06;
        renderer.render(scene, camera);
      },
      () => !visibleRef.current
    );

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      window.removeEventListener("scroll", updateScroll);

      geometriesToDispose.forEach((g) => g.dispose());
      titaniumDarkMat.dispose();
      matteCarbonMat.dispose();
      brushedAmberMat.dispose();
      cyanEmissiveMat.dispose();
      wireframeAuraMat.dispose();
      starMat.dispose();
      shadowMat.dispose();
      poolMat.dispose();
      (cageLines.material as THREE.Material).dispose();
      bumpTex.dispose();
      shadowTex.dispose();
      poolTex.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="about-3d-stage"
      data-active-mode={mode}
      data-spot-x="0.000"
      data-spot-y="0.000"
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
