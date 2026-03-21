import React, { useEffect, useRef, useCallback, useState, RefObject, Dispatch, SetStateAction } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform vec2 u_center;
  uniform float u_zoom;
  uniform int u_max_iterations;
  uniform int u_color_scheme;
  uniform int u_fractal_type;
  uniform vec2 u_julia_c;
  uniform float u_time;
  uniform float u_cycle_speed;

  vec3 getColor(float iteration, float max_iterations) {
    if (iteration >= max_iterations) return vec3(0.0, 0.0, 0.0);
    
    float t = iteration * 0.1;
    float cycle = u_time * u_cycle_speed;
    
    if (u_color_scheme == 0) {
        return vec3(
            0.5 + 0.5 * cos(3.0 + t + cycle * 0.5),
            0.5 + 0.5 * cos(3.0 + t * 0.7 + cycle * 0.3),
            0.5 + 0.5 * cos(3.0 + t * 0.5 + cycle * 0.2)
        );
    } else if (u_color_scheme == 1) {
        return vec3(
            0.5 + 0.5 * cos(t * 0.8 + cycle),
            0.5 + 0.5 * cos(1.0 + t * 0.6 + cycle * 0.8),
            0.5 + 0.5 * cos(2.0 + t * 0.4 + cycle * 0.6)
        );
    } else if (u_color_scheme == 2) {
        float p = t * 2.0 + cycle * 2.0;
        return vec3(
            0.5 + 0.5 * sin(p),
            0.5 + 0.5 * sin(p + 2.094),
            0.5 + 0.5 * sin(p + 4.188)
        );
    } else if (u_color_scheme == 3) {
        float p = t * 5.0 + cycle * 3.0;
        return vec3(
            abs(sin(p)),
            abs(cos(p * 0.5)),
            abs(sin(p * 0.2))
        );
    } else {
        float v = 0.5 + 0.5 * cos(t + cycle);
        return vec3(v, v, v * 1.1);
    }
}

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 pos = u_center + uv * u_zoom;
    vec2 z;
    vec2 c;
    
    if (u_fractal_type == 1) {
        z = pos;
        c = u_julia_c;
    } else {
        z = vec2(0.0);
        c = pos;
    }
    
    float iteration = 0.0;
    float max_i = float(u_max_iterations);
    
    for (int i = 0; i < 1000; i++) {
      if (float(i) >= max_i) break;
      float x, y;
      if (u_fractal_type == 2) {
          x = (z.x * z.x - z.y * z.y) + c.x;
          y = abs(2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
          z = abs(z);
      } else if (u_fractal_type == 3) {
          x = (z.x * z.x - z.y * z.y) + c.x;
          y = (-2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
      } else if (u_fractal_type == 4) {
          x = z.x * (z.x * z.x - 3.0 * z.y * z.y) + c.x;
          y = z.y * (3.0 * z.x * z.x - z.y * z.y) + c.y;
          z = vec2(x, y);
      } else if (u_fractal_type == 5) {
          float x2 = z.x * z.x;
          float y2 = z.y * z.y;
          x = (x2 * x2 - 6.0 * x2 * y2 + y2 * y2) + c.x;
          y = (4.0 * z.x * z.y * (x2 - y2)) + c.y;
          z = vec2(x, y);
      } else if (u_fractal_type == 6 || u_fractal_type == 10 || u_fractal_type == 11) {
          float p = 3.14159265;
          if (u_fractal_type == 10) p = 1.61803398;
          if (u_fractal_type == 11) p = 6.28318530;
          float r = length(z);
          float theta = atan(z.y, z.x);
          float rp = pow(r, p);
          z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
      } else if (u_fractal_type == 7) {
          x = abs(z.x * z.x - z.y * z.y) + c.x;
          y = (2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
      } else if (u_fractal_type == 8) {
          x = abs(z.x * z.x - z.y * z.y) + c.x;
          y = abs(2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
      } else if (u_fractal_type == 9) {
          float d = dot(z, z);
          if (d < 0.0001) d = 0.0001;
          vec2 invZ = vec2(z.x / d, -z.y / d);
          x = (invZ.x * invZ.x - invZ.y * invZ.y) + c.x;
          y = (2.0 * invZ.x * invZ.y) + c.y;
          z = vec2(x, y);
      } else {
          x = (z.x * z.x - z.y * z.y) + c.x;
          y = (2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
      }
      if (dot(z, z) > 16.0) break;
      iteration += 1.0;
    }
    if (iteration < max_i) {
        float zn = length(z);
        float nu = log(log(zn) / log(2.0)) / log(2.0);
        iteration = iteration + 1.0 - nu;
    }
    gl_FragColor = vec4(getColor(iteration, max_i), 1.0);
  }
`;

interface UseRendererProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  center: { x: number, y: number };
  zoom: number;
  maxIterations: number;
  autoIterations: boolean;
  colorScheme: number;
  fractalType: number;
  juliaC: { x: number, y: number };
  cycleSpeed: number;
  resolutionScale: number;
  setJuliaC: Dispatch<SetStateAction<{ x: number, y: number }>>;
}

export const useMandelbrotRenderer = ({
  canvasRef,
  center,
  zoom,
  maxIterations,
  autoIterations,
  colorScheme,
  fractalType,
  juliaC,
  cycleSpeed,
  resolutionScale,
  setJuliaC
}: UseRendererProps) => {
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const [time, setTime] = useState(0);

  const effectiveIterations = autoIterations 
    ? Math.min(3000, Math.floor(250 + Math.log2(1 / zoom) * 120))
    : maxIterations;

  const isAtPrecisionLimit = zoom < 1e-7;

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const centerLoc = gl.getUniformLocation(program, 'u_center');
    const zoomLoc = gl.getUniformLocation(program, 'u_zoom');
    const iterLoc = gl.getUniformLocation(program, 'u_max_iterations');
    const colorLoc = gl.getUniformLocation(program, 'u_color_scheme');
    const fractalLoc = gl.getUniformLocation(program, 'u_fractal_type');
    const juliaLoc = gl.getUniformLocation(program, 'u_julia_c');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const speedLoc = gl.getUniformLocation(program, 'u_cycle_speed');

    gl.uniform2f(resLoc, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(centerLoc, center.x, center.y);
    gl.uniform1f(zoomLoc, zoom);
    gl.uniform1i(iterLoc, effectiveIterations);
    gl.uniform1i(colorLoc, colorScheme);
    gl.uniform1i(fractalLoc, fractalType);
    gl.uniform2f(juliaLoc, juliaC.x, juliaC.y);
    gl.uniform1f(timeLoc, time);
    gl.uniform1f(speedLoc, cycleSpeed);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [center, zoom, effectiveIterations, colorScheme, fractalType, juliaC, time, cycleSpeed]);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      if (cycleSpeed > 0) {
        setTime(prev => prev + deltaTime);
      }
      
      if (fractalType === 1 && cycleSpeed > 0) {
          setJuliaC(prev => ({
              x: prev.x + Math.sin(currentTime * 0.0005) * 0.0001,
              y: prev.y + Math.cos(currentTime * 0.0003) * 0.0001
          }));
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cycleSpeed, fractalType, setJuliaC]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true });
    if (!gl) return;
    glRef.current = gl;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    programRef.current = program;

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const handleResize = () => {
      canvas.width = window.innerWidth * resolutionScale;
      canvas.height = window.innerHeight * resolutionScale;
      gl.viewport(0, 0, canvas.width, canvas.height);
      render();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [resolutionScale, render, canvasRef]);

  useEffect(() => {
    render();
  }, [render]);

  return { effectiveIterations, isAtPrecisionLimit, render };
};
