import * as THREE from "three";

/**
 * Probes the active WebGL2 renderer string to detect software rasterizers
 * (SwiftShader, llvmpipe, WARP) without touching user-agent heuristics.
 */
export function detectSoftwareWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const probeCanvas = document.createElement("canvas");
    const gl = probeCanvas.getContext("webgl2");
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? "");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Software-WebGL-safe frame pacing using fenceSync on SwiftShader so CPU
 * rasterization never starves the main thread or blocks screenshots, while
 * real GPUs run at full monitor refresh via requestAnimationFrame.
 */
export function createPacedRenderLoop(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
  onFrame: (deltaSec: number, elapsedSec: number) => void,
  shouldPause: () => boolean
): () => void {
  let frameId = 0;
  let disposed = false;
  let lastTime = performance.now();
  const startTime = lastTime;

  const afterDraw = (cb: () => void) => {
    const gl = renderer.getContext() as WebGL2RenderingContext | null;
    if (!gl || typeof gl.fenceSync !== "function") {
      frameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
      if (state === gl.UNSIGNALED) {
        frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        frameId = window.setTimeout(cb, 80);
      }
    };
    frameId = window.setTimeout(poll, 5);
  };

  const tick = () => {
    if (disposed) return;

    if (shouldPause()) {
      frameId = isSoftwareGl
        ? window.setTimeout(tick, 120)
        : requestAnimationFrame(tick);
      lastTime = performance.now();
      return;
    }

    const now = performance.now();
    const deltaSec = Math.min(0.1, (now - lastTime) / 1000);
    const elapsedSec = (now - startTime) / 1000;
    lastTime = now;

    onFrame(deltaSec, elapsedSec);

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }
  };

  frameId = requestAnimationFrame(tick);

  return () => {
    disposed = true;
    cancelAnimationFrame(frameId);
    clearTimeout(frameId);
  };
}
