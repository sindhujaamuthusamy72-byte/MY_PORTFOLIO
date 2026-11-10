import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useViewportActivation';

const CLOTH_TEX_SRC = '/assets/journey-flying-cloth.png';
const GIRL_TEX_SRC = '/assets/journey-flying-girl.png';

const VERT_SHADER_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_position.x * 0.5 + 0.5, 0.5 - a_position.y * 0.5);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG_SHADER_SRC = `
precision mediump float;
varying vec2 v_uv;

uniform sampler2D u_clothTex;
uniform sampler2D u_girlTex;
uniform float u_scrollPhase;
uniform float u_idlePhase;
uniform float u_velocityAmp;
uniform float u_opacity;

void main() {
  // Shoulder attachment clasp is anchored around u = 0.715; pin wave displacement smoothly to 0 there
  float anchorDist = clamp((0.715 - v_uv.x) / 0.715, 0.0, 1.0);
  float pinEnv = pow(anchorDist, 1.42);

  // Multi-harmonic fabric waves responding to scroll direction, progress, and velocity
  float wavePrimary = sin(anchorDist * 8.4 - u_scrollPhase * 2.15 - u_idlePhase * 1.05 + v_uv.y * 2.3);
  float waveFold = sin(anchorDist * 15.6 - u_scrollPhase * 3.35 - u_idlePhase * 1.85 - v_uv.y * 5.6 + 1.15);
  float waveFlutter = sin(anchorDist * 24.5 - u_scrollPhase * 5.1 - u_idlePhase * 2.65 + v_uv.y * 8.2) * u_velocityAmp;

  float baseAmp = 0.0165 + 0.018 * u_velocityAmp;
  float dy = pinEnv * baseAmp * (0.62 * wavePrimary + 0.28 * waveFold + 0.16 * waveFlutter);
  float dx = pinEnv * (baseAmp * 0.36) * (
    cos(anchorDist * 8.4 - u_scrollPhase * 2.15 - u_idlePhase * 1.05 + v_uv.y * 2.3) * 0.68 +
    sin(v_uv.y * 4.1 + anchorDist * 5.8 - u_scrollPhase * 1.55) * 0.32
  );

  vec2 clothUv = clamp(v_uv - vec2(dx, dy), vec2(0.0), vec2(1.0));
  vec4 cloth = texture2D(u_clothTex, clothUv);

  // Subtle volumetric crimson silk catchlight gliding along wave crests
  float waveCrest = cos(anchorDist * 15.6 - u_scrollPhase * 3.35 - u_idlePhase * 1.85 - v_uv.y * 5.6 + 1.15);
  float shimmer = 1.0 + pinEnv * waveCrest * (0.075 + 0.095 * u_velocityAmp);
  vec3 clothLit = clamp(cloth.rgb * shimmer, 0.0, 1.0);

  // Fixed flying girl silhouette always sampled at exact un-warped identity UV
  vec4 girl = texture2D(u_girlTex, v_uv);

  // Premultiplied Porter-Duff composite: stable Girl layer over waving Cloth layer
  vec3 clothPremul = clothLit * cloth.a;
  vec3 girlPremul = girl.rgb * girl.a;
  vec3 outRgb = girlPremul + clothPremul * (1.0 - girl.a);
  float outAlpha = clamp(girl.a + cloth.a * (1.0 - girl.a), 0.0, 1.0);

  gl_FragColor = vec4(outRgb * u_opacity, outAlpha * u_opacity);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createTextureFromImage(gl, image) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return tex;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Renders the separated flying-silhouette + scroll-responsive crimson cloth layers
 * using a WebGL shader mesh (with 2D strip-mesh fallback), keeping the girl completely
 * stable while the red fabric flows continuously with scroll progress and velocity.
 */
export default function JourneyFlyingBackground({ sectionRef }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let cancelled = false;
    let rafId = 0;
    let isVisible = true;
    let observer = null;

    // Smoothed scroll kinematics shared across frames
    const sim = {
      lastScrollY: window.scrollY,
      targetScrollPhase: 0,
      scrollPhase: 0,
      rawVelocity: 0,
      smoothVelocity: 0,
      idlePhase: 0,
      lastTime: performance.now(),
    };

    const handleScroll = () => {
      if (prefersReducedMotion) return;
      const nowY = window.scrollY;
      const deltaY = nowY - sim.lastScrollY;
      sim.lastScrollY = nowY;
      // Forward scroll drives wave outward along trailing cloth; upward scroll reverses cleanly
      sim.targetScrollPhase += deltaY * 0.0115;
      sim.rawVelocity = Math.min(2.2, Math.max(-2.2, sim.rawVelocity + deltaY * 0.012));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let cleanupGpu = () => {};

    Promise.all([loadImage(CLOTH_TEX_SRC), loadImage(GIRL_TEX_SRC)])
      .then(([clothImg, girlImg]) => {
        if (cancelled) return;

        const w = 647;
        const h = 422;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);

        const gl = canvas.getContext('webgl', {
          alpha: true,
          premultipliedAlpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });

        let drawFrame;

        if (gl) {
          const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SHADER_SRC);
          const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER_SRC);
          const prog = gl.createProgram();
          if (vs && fs && prog) {
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
              const quadBuf = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
              gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
                gl.STATIC_DRAW
              );

              const clothTex = createTextureFromImage(gl, clothImg);
              const girlTex = createTextureFromImage(gl, girlImg);

              const locPos = gl.getAttribLocation(prog, 'a_position');
              const locCloth = gl.getUniformLocation(prog, 'u_clothTex');
              const locGirl = gl.getUniformLocation(prog, 'u_girlTex');
              const locScrollPhase = gl.getUniformLocation(prog, 'u_scrollPhase');
              const locIdlePhase = gl.getUniformLocation(prog, 'u_idlePhase');
              const locVelAmp = gl.getUniformLocation(prog, 'u_velocityAmp');
              const locOpacity = gl.getUniformLocation(prog, 'u_opacity');

              gl.viewport(0, 0, canvas.width, canvas.height);

              drawFrame = (scrollPhase, idlePhase, velocityAmp) => {
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.useProgram(prog);

                gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
                gl.enableVertexAttribArray(locPos);
                gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, clothTex);
                gl.uniform1i(locCloth, 0);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, girlTex);
                gl.uniform1i(locGirl, 1);

                gl.uniform1f(locScrollPhase, scrollPhase);
                gl.uniform1f(locIdlePhase, idlePhase);
                gl.uniform1f(locVelAmp, velocityAmp);
                gl.uniform1f(locOpacity, 1.0);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
              };

              cleanupGpu = () => {
                gl.deleteTexture(clothTex);
                gl.deleteTexture(girlTex);
                gl.deleteBuffer(quadBuf);
                gl.deleteShader(vs);
                gl.deleteShader(fs);
                gl.deleteProgram(prog);
              };
            }
          }
        }

        // 2D Canvas strip-mesh fallback when WebGL context is unavailable
        if (!drawFrame) {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const stripCount = 48;
          const anchorX = w * 0.715;
          drawFrame = (scrollPhase, idlePhase, velocityAmp) => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            // Pass 1: Strip-sliced waving cloth layer pinned cleanly at her shoulders
            for (let i = 0; i < stripCount; i++) {
              const sx = (i / stripCount) * anchorX;
              const sw = Math.ceil(anchorX / stripCount) + 1;
              const u = (sx + sw * 0.5) / w;
              const anchorDist = Math.max(0, Math.min(1, (0.715 - u) / 0.715));
              const pinEnv = Math.pow(anchorDist, 1.42);
              const wave =
                0.65 * Math.sin(anchorDist * 8.4 - scrollPhase * 2.15 - idlePhase * 1.05) +
                0.35 * Math.sin(anchorDist * 15.6 - scrollPhase * 3.35 - idlePhase * 1.85);
              const dyPx = pinEnv * (7 + 9 * velocityAmp) * wave;
              ctx.drawImage(clothImg, sx, 0, sw, h, sx, dyPx, sw, h);
            }

            // Pass 2: Static girl silhouette directly on top at identity coordinates
            ctx.drawImage(girlImg, 0, 0, w, h);
          };
        }

        // Always render crisp initial frame
        drawFrame(0, 0, 0);
        if (prefersReducedMotion) return;

        const tick = (now) => {
          if (cancelled) return;
          const dt = Math.min(0.05, Math.max(0.001, (now - sim.lastTime) / 1000));
          sim.lastTime = now;

          if (isVisible) {
            const blend = 1 - Math.exp(-dt * 7.5);
            sim.scrollPhase += (sim.targetScrollPhase - sim.scrollPhase) * blend;
            sim.rawVelocity *= Math.exp(-dt * 4.5);
            sim.smoothVelocity += (Math.abs(sim.rawVelocity) - sim.smoothVelocity) * (1 - Math.exp(-dt * 9));
            sim.idlePhase += dt * 0.62;

            drawFrame(sim.scrollPhase, sim.idlePhase, Math.min(1.0, sim.smoothVelocity));
          }

          rafId = requestAnimationFrame(tick);
        };

        if (sectionRef?.current && typeof IntersectionObserver !== 'undefined') {
          observer = new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (!entry) return;
              isVisible = entry.isIntersecting;
              if (isVisible) {
                sim.lastTime = performance.now();
              }
            },
            { rootMargin: '240px 0px 240px 0px', threshold: 0.01 }
          );
          observer.observe(sectionRef.current);
        }

        rafId = requestAnimationFrame(tick);
      })
      .catch(() => {
        // Artwork images failed to decode; keep section gracefully styled on dark background
      });

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      cleanupGpu();
    };
  }, [sectionRef, prefersReducedMotion]);

  return (
    <div className="journey-flying-bg-layer" aria-hidden="true">
      <div className="journey-flying-sticky-frame">
        <div className="journey-flying-silhouette-aura" />
        <div className="journey-flying-artwork-stage">
          <canvas
            ref={canvasRef}
            className="journey-flying-canvas"
            aria-label="Flying silhouette with crimson cloth waving gently on scroll"
          />
        </div>
        <div className="journey-flying-edge-vignette" />
      </div>
    </div>
  );
}

