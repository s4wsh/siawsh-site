import React, { useEffect, useRef } from 'react';

/**
 * Minimalist Night Sky & Deep Gateway Shader
 * Deferred compilation and performance-tuned render pipeline to minimize Total Blocking Time (TBT).
 */
export default function GatewayWebGLBackground({ activeDiscipline = null }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ 
    x: 0.5, 
    y: 0.5, 
    targetX: 0.5, 
    targetY: 0.5, 
    isInteracting: false 
  });
  const modeRef = useRef(0.0);
  const activeDisciplineRef = useRef(activeDiscipline);

  // Keep activeDiscipline ref updated without triggering full WebGL context rebuilds
  useEffect(() => {
    activeDisciplineRef.current = activeDiscipline;
  }, [activeDiscipline]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let isMounted = true;
    let idleId;
    let timeoutId;

    let gl;
    let positionBuffer;
    let vertShader;
    let fragShader;
    let program;
    let handleResize;
    let handleMouseMove;
    let handleTouchMove;
    let handleTouchEnd;
    let handleVisibilityChange;

    const initWebGL = () => {
      if (!isMounted) return;

      // Disable stencil & depth buffers to minimize GPU allocation overhead
      gl = canvas.getContext('webgl', { 
        powerPreference: 'low-power', 
        alpha: false, 
        depth: false, 
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false
      }) || canvas.getContext('experimental-webgl');

      if (!gl) return;

      const vsSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
          v_uv = a_position * 0.5 + 0.5;
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_mode;
        varying vec2 v_uv;

        float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        vec2 hash22(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.xx + p3.yz) * p3.zy);
        }

        float valueNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);

          return mix(
            mix(hash12(i + vec2(0.0, 0.0)), hash12(i + vec2(1.0, 0.0)), u.x),
            mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float val = 0.0;
          float amp = 0.5;
          mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 4; i++) {
            val += amp * valueNoise(p);
            p = rot * p * 2.02;
            amp *= 0.5;
          }
          return val;
        }

        float starField(vec2 uv, float scale, float probability) {
          vec2 gridUv = uv * scale;
          vec2 id = floor(gridUv);
          vec2 gv = fract(gridUv) - 0.5;

          vec2 p = hash22(id);
          float rand = p.x;
          if (rand < probability) return 0.0;

          vec2 offset = (p - 0.5) * 0.7;
          float d = length(gv - offset);

          float twinkle = sin(u_time * 1.5 + rand * 6.28) * 0.25 + 0.75;
          float star = smoothstep(0.035, 0.0, d) * twinkle;

          if (rand > 0.975) {
            vec2 starP = abs(gv - offset);
            float flare = smoothstep(0.12, 0.0, starP.x + starP.y) * 0.25;
            star = max(star, flare * twinkle);
          }

          return star;
        }

        void main() {
          vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
          vec2 mouse = (u_mouse - 0.5 * u_resolution.xy) / u_resolution.y;

          float gateFactor = u_mode;
          float distFromCenter = length(st);
          vec2 dir = distFromCenter > 0.001 ? normalize(st) : vec2(0.0);

          vec2 gateSt = st + dir * (exp(-distFromCenter * 2.0) * gateFactor * 0.18);
          gateSt *= 1.0 - gateFactor * 0.08;

          float mouseDist = length(gateSt - mouse);
          float lensFactor = exp(-mouseDist * 3.5) * 0.012;
          vec2 finalSt = gateSt - (gateSt - mouse) * lensFactor;

          float t = u_time * 0.018;
          mat2 galacticRot = mat2(cos(t), -sin(t), sin(t), cos(t));
          vec2 rotSt = galacticRot * finalSt;

          vec3 deepNightSky = vec3(0.008, 0.018, 0.042);
          vec3 midnightBlue = vec3(0.022, 0.048, 0.105);
          vec3 nebulaGlow   = vec3(0.10,  0.22,  0.42);

          float coreDist = length(rotSt * vec2(1.1, 0.85));
          float galacticCore = exp(-coreDist * 2.0) * 0.16;

          vec2 q = vec2(fbm(rotSt * 1.1 + vec2(0.0, t * 0.4)), fbm(rotSt * 1.1 + vec2(1.2, 2.5)));
          float nebulaDust = fbm(rotSt * 1.6 + q * 1.1);
          nebulaDust = smoothstep(0.2, 0.7, nebulaDust) * 0.12;

          float starsFar    = starField(rotSt, 55.0, 0.85) * 0.4;
          float starsMid    = starField(rotSt, 30.0, 0.90) * 0.7;
          float starsBright = starField(rotSt, 14.0, 0.96) * 0.95;

          float totalStars = starsFar + starsMid + starsBright;
          float pointerAura = smoothstep(0.35, 0.0, mouseDist) * 0.03;

          vec3 finalColor = mix(deepNightSky, midnightBlue, nebulaDust * 2.0);
          vec3 starWhite = vec3(0.96, 0.98, 1.0);
          finalColor += nebulaGlow * galacticCore;
          finalColor += starWhite * totalStars;
          finalColor += starWhite * pointerAura;
          finalColor += vec3(0.06, 0.10, 0.20) * (exp(-distFromCenter * 1.8) * gateFactor * 0.14);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      const createShader = (glCtx, type, source) => {
        const shader = glCtx.createShader(type);
        glCtx.shaderSource(shader, source);
        glCtx.compileShader(shader);
        if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
          glCtx.deleteShader(shader);
          return null;
        }
        return shader;
      };

      vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if (!vertShader || !fragShader) return;

      program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const uResLoc = gl.getUniformLocation(program, 'u_resolution');
      const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
      const uTimeLoc = gl.getUniformLocation(program, 'u_time');
      const uModeLoc = gl.getUniformLocation(program, 'u_mode');

      const getDPR = () => Math.min(window.devicePixelRatio || 1, 1.0);

      handleResize = () => {
        const dpr = getDPR();
        const width = (canvas.width = Math.floor(window.innerWidth * dpr));
        const height = (canvas.height = Math.floor(window.innerHeight * dpr));
        gl.viewport(0, 0, width, height);

        if (!mouseRef.current.isInteracting) {
          mouseRef.current.targetX = width / 2;
          mouseRef.current.targetY = height / 2;
        }
      };
      window.addEventListener('resize', handleResize);
      handleResize();

      // Passive Event Listeners to prevent main-thread scrolling/interaction delays
      handleMouseMove = (e) => {
        const dpr = getDPR();
        mouseRef.current.targetX = e.clientX * dpr;
        mouseRef.current.targetY = canvas.height - e.clientY * dpr;
        mouseRef.current.isInteracting = true;
      };

      handleTouchMove = (e) => {
        if (e.touches && e.touches[0]) {
          const dpr = getDPR();
          mouseRef.current.targetX = e.touches[0].clientX * dpr;
          mouseRef.current.targetY = canvas.height - e.touches[0].clientY * dpr;
          mouseRef.current.isInteracting = true;
        }
      };

      handleTouchEnd = () => {
        mouseRef.current.isInteracting = false;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchstart', handleTouchMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });

      let startTime = performance.now();
      let lastFrameTime = 0;
      const targetFPS = 24; // Lowered to 24fps for low GPU/CPU footprint
      const frameInterval = 1000 / targetFPS;

      const render = (now) => {
        if (!isMounted) return;

        if (document.hidden) {
          animId = requestAnimationFrame(render);
          return;
        }

        const delta = now - lastFrameTime;
        if (delta < frameInterval) {
          animId = requestAnimationFrame(render);
          return;
        }

        lastFrameTime = now - (delta % frameInterval);

        const elapsed = (now - startTime) * 0.001;
        const m = mouseRef.current;

        if (!m.isInteracting) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) * 0.05;
          
          m.targetX = centerX + Math.cos(elapsed * 0.25) * radius;
          m.targetY = centerY + Math.sin(elapsed * 0.35) * radius;
        }

        m.x += (m.targetX - m.x) * 0.02;
        m.y += (m.targetY - m.y) * 0.02;

        const targetModeVal = activeDisciplineRef.current ? 1.0 : 0.0;
        modeRef.current += (targetModeVal - modeRef.current) * 0.035;

        gl.uniform2f(uResLoc, canvas.width, canvas.height);
        gl.uniform2f(uMouseLoc, m.x, m.y);
        gl.uniform1f(uTimeLoc, elapsed);
        gl.uniform1f(uModeLoc, modeRef.current);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animId = requestAnimationFrame(render);
      };

      handleVisibilityChange = () => {
        if (!document.hidden) {
          startTime = performance.now();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      animId = requestAnimationFrame(render);
    };

    // Defer GL init by 500ms using requestIdleCallback to free main-thread for initial paint
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(() => initWebGL(), { timeout: 500 });
    } else {
      timeoutId = setTimeout(() => initWebGL(), 350);
    }

    return () => {
      isMounted = false;
      if (idleId) cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);

      if (handleResize) window.removeEventListener('resize', handleResize);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleTouchMove) {
        window.removeEventListener('touchstart', handleTouchMove);
        window.removeEventListener('touchmove', handleTouchMove);
      }
      if (handleTouchEnd) window.removeEventListener('touchend', handleTouchEnd);
      if (handleVisibilityChange) document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (animId) cancelAnimationFrame(animId);

      if (gl) {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (vertShader) gl.deleteShader(vertShader);
        if (fragShader) gl.deleteShader(fragShader);
        if (program) gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}