import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, Move, RefreshCw, Info, Maximize2, Minimize2, Palette } from 'lucide-react';

// WebGL Shader Sources
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

  // Smooth coloring function
  vec3 getColor(float iteration, float max_iterations) {
    if (iteration >= max_iterations) return vec3(0.0, 0.0, 0.0);
    
    float t = iteration * 0.1;
    float cycle = u_time * u_cycle_speed;
    
    if (u_color_scheme == 0) {
        // Cosmic Blue/Purple (Cycling)
        return vec3(
            0.5 + 0.5 * cos(3.0 + t + cycle * 0.5),
            0.5 + 0.5 * cos(3.0 + t * 0.7 + cycle * 0.3),
            0.5 + 0.5 * cos(3.0 + t * 0.5 + cycle * 0.2)
        );
    } else if (u_color_scheme == 1) {
        // Fire/Gold (Cycling)
        return vec3(
            0.5 + 0.5 * cos(t * 0.8 + cycle),
            0.5 + 0.5 * cos(1.0 + t * 0.6 + cycle * 0.8),
            0.5 + 0.5 * cos(2.0 + t * 0.4 + cycle * 0.6)
        );
    } else if (u_color_scheme == 2) {
        // Plasma Clouds (Classic Cycling)
        float p = t * 2.0 + cycle * 2.0;
        return vec3(
            0.5 + 0.5 * sin(p),
            0.5 + 0.5 * sin(p + 2.094),
            0.5 + 0.5 * sin(p + 4.188)
        );
    } else if (u_color_scheme == 3) {
        // Electric Neon
        float p = t * 5.0 + cycle * 3.0;
        return vec3(
            abs(sin(p)),
            abs(cos(p * 0.5)),
            abs(sin(p * 0.2))
        );
    } else {
        // Monochrome / Silver
        float v = 0.5 + 0.5 * cos(t + cycle);
        return vec3(v, v, v * 1.1);
    }
}

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    // Calculate complex coordinate
    vec2 pos = u_center + uv * u_zoom;
    
    vec2 z;
    vec2 c;
    
    if (u_fractal_type == 1) {
        // Julia Set
        z = pos;
        c = u_julia_c;
    } else {
        // Mandelbrot and variants
        z = vec2(0.0);
        c = pos;
    }
    
    float iteration = 0.0;
    float max_i = float(u_max_iterations);
    
    for (int i = 0; i < 1000; i++) {
      if (float(i) >= max_i) break;
      
      float x, y;
      
      if (u_fractal_type == 2) {
          // Burning Ship
          x = (z.x * z.x - z.y * z.y) + c.x;
          y = abs(2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
          z = abs(z);
      } else if (u_fractal_type == 3) {
          // Tricorn
          x = (z.x * z.x - z.y * z.y) + c.x;
          y = (-2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
      } else {
          // Mandelbrot / Julia (Standard z^2 + c)
          x = (z.x * z.x - z.y * z.y) + c.x;
          y = (2.0 * z.x * z.y) + c.y;
          z = vec2(x, y);
      }
      
      if (dot(z, z) > 16.0) break;
      iteration += 1.0;
    }
    
    // Smooth coloring adjustment
    if (iteration < max_i) {
        float zn = length(z);
        float nu = log(log(zn) / log(2.0)) / log(2.0);
        iteration = iteration + 1.0 - nu;
    }

    gl_FragColor = vec4(getColor(iteration, max_i), 1.0);
  }
`;

export const MandelbrotExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  
  // State for view parameters
  const [center, setCenter] = useState({ x: -0.5, y: 0 });
  const [zoom, setZoom] = useState(3.0);
  const [maxIterations, setMaxIterations] = useState(150);
  const [autoIterations, setAutoIterations] = useState(true);
  const [colorScheme, setColorScheme] = useState(0);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);
  const [fractalType, setFractalType] = useState(0); // 0: Mandelbrot, 1: Julia, 2: Burning Ship, 3: Tricorn
  const [juliaC, setJuliaC] = useState({ x: -0.8, y: 0.156 });
  const [cycleSpeed, setCycleSpeed] = useState(0.0);
  const [resolutionScale, setResolutionScale] = useState(window.devicePixelRatio || 1);
  const [time, setTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Calculate iterations based on zoom if auto is on
  const effectiveIterations = autoIterations 
    ? Math.min(1000, Math.max(maxIterations, Math.floor(150 + Math.log10(1/zoom) * 100)))
    : maxIterations;

  // Animation loop for palette cycling
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      if (cycleSpeed > 0) {
        setTime(prev => prev + deltaTime);
      }
      
      // Animate Julia C slightly if it's a Julia set
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
  }, [cycleSpeed, fractalType]);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true });
    if (!gl) {
      alert('WebGL not supported');
      return;
    }
    glRef.current = gl;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Set up full-screen quad
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

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
  }, [resolutionScale]);

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

  useEffect(() => {
    render();
  }, [render]);

  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const mouseDownTimeRef = useRef<number>(0);
  const mouseDownPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = (clientX - rect.left - rect.width / 2) / Math.min(rect.width, rect.height);
    const mouseY = -(clientY - rect.top - rect.height / 2) / Math.min(rect.width, rect.height);
    
    const newZoom = zoom * factor;
    
    setCenter(prev => ({
        x: prev.x + mouseX * (zoom - newZoom),
        y: prev.y + mouseY * (zoom - newZoom)
    }));
    setZoom(newZoom);
  }, [zoom]);

  // Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const now = performance.now();
    mouseDownTimeRef.current = now;

    if ('touches' in e) {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      mouseDownPosRef.current = { x: touch.clientX, y: touch.clientY };

      if (e.touches.length === 1) {
        setIsDragging(true);
        setLastMousePos({ x: touch.clientX, y: touch.clientY });
        setLastTouchDistance(null);
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        setLastTouchDistance(dist);
      }
    } else {
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      if (e.cancelable) e.preventDefault();
      if (e.touches.length === 1 && isDragging) {
        const pos = e.touches[0];
        const dx = pos.clientX - lastMousePos.x;
        const dy = pos.clientY - lastMousePos.y;
        const scale = zoom / Math.min(window.innerWidth, window.innerHeight);
        setCenter(prev => ({
          x: prev.x - dx * scale,
          y: prev.y + dy * scale
        }));
        setLastMousePos({ x: pos.clientX, y: pos.clientY });
      } else if (e.touches.length === 2 && lastTouchDistance !== null) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = lastTouchDistance / dist;
        setZoom(prev => prev * factor);
        setLastTouchDistance(dist);
      }
    } else if (isDragging) {
      const pos = e as React.MouseEvent;
      const dx = pos.clientX - lastMousePos.x;
      const dy = pos.clientY - lastMousePos.y;
      const scale = zoom / Math.min(window.innerWidth, window.innerHeight);
      setCenter(prev => ({
        x: prev.x - dx * scale,
        y: prev.y + dy * scale
      }));
      setLastMousePos({ x: pos.clientX, y: pos.clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    const now = performance.now();
    const dt = now - mouseDownTimeRef.current;
    
    let endX, endY;
    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else {
      endX = (e as React.MouseEvent).clientX;
      endY = (e as React.MouseEvent).clientY;
    }

    const dist = Math.hypot(endX - mouseDownPosRef.current.x, endY - mouseDownPosRef.current.y);

    // Detect click: short duration and minimal movement
    if (dt < 250 && dist < 10) {
      const isShift = 'shiftKey' in e && (e as React.MouseEvent).shiftKey;
      zoomAt(endX, endY, isShift ? 2.0 : 0.5);
    }

    setIsDragging(false);
    setLastTouchDistance(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    
    // Zoom towards mouse position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
        const mouseX = (e.clientX - rect.left - rect.width / 2) / Math.min(rect.width, rect.height);
        const mouseY = -(e.clientY - rect.top - rect.height / 2) / Math.min(rect.width, rect.height);
        
        const newZoom = zoom * zoomFactor;
        
        setCenter(prev => ({
            x: prev.x + mouseX * (zoom - newZoom),
            y: prev.y + mouseY * (zoom - newZoom)
        }));
        setZoom(newZoom);
    }
  };

  const adjustZoom = (factor: number) => {
    setZoom(prev => prev * factor);
  };

  const resetView = () => {
    if (fractalType === 1) {
        setCenter({ x: 0, y: 0 });
        setZoom(3.0);
    } else {
        setCenter({ x: -0.5, y: 0 });
        setZoom(3.0);
    }
    setMaxIterations(150);
  };

  const fractals = [
      { id: 0, name: "Mandelbrot" },
      { id: 1, name: "Julia Set" },
      { id: 2, name: "Burning Ship" },
      { id: 3, name: "Tricorn" }
  ];

  const palettes = [
      { id: 0, name: "Cosmic" },
      { id: 1, name: "Fire" },
      { id: 2, name: "Plasma" },
      { id: 3, name: "Neon" },
      { id: 4, name: "Silver" }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-move"
      />

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 flex flex-col gap-4 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl pointer-events-auto"
        >
          <h1 className="text-xl font-bold tracking-tight mb-1">Infinity Explorer</h1>
          <p className="text-xs text-white/60">{fractals[fractalType].name}</p>
        </motion.div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <ControlButton icon={<RefreshCw size={20} />} onClick={resetView} label="Reset View" />
          
          <div className="relative">
            <ControlButton 
                icon={<Palette size={20} />} 
                onClick={() => setShowPaletteMenu(!showPaletteMenu)} 
                active={showPaletteMenu}
                label="Palettes" 
            />
            <AnimatePresence>
                {showPaletteMenu && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="absolute left-14 top-0 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col gap-1 min-w-[120px] shadow-2xl z-50"
                    >
                        {palettes.map(p => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setColorScheme(p.id);
                                    setShowPaletteMenu(false);
                                }}
                                className={`text-[10px] px-3 py-2 rounded-lg text-left transition-all ${colorScheme === p.id ? 'bg-white text-black' : 'hover:bg-white/10 text-white/60'}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <ControlButton 
            icon={<Maximize2 size={20} />} 
            onClick={() => setResolutionScale(prev => prev === 1 ? window.devicePixelRatio || 2 : 1)} 
            active={resolutionScale > 1}
            label={resolutionScale > 1 ? "High Res On" : "High Res Off"} 
          />
          <ControlButton 
            icon={<Move size={20} />} 
            onClick={() => setShowControls(!showControls)} 
            active={showControls}
            label={showControls ? "Hide Controls" : "Show Controls"} 
          />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4 pointer-events-none">
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl max-w-xs pointer-events-auto shadow-2xl"
            >
              <h3 className="font-bold mb-2 text-indigo-300">Navigation</h3>
              <ul className="text-sm space-y-2 text-white/80">
                <li className="flex items-center gap-2"><Move size={14} /> Drag or swipe to pan</li>
                <li className="flex items-center gap-2"><Maximize2 size={14} /> Click or tap to zoom in</li>
                <li className="flex items-center gap-2"><ZoomOut size={14} /> Shift-click to zoom out</li>
                <li className="flex items-center gap-2"><RefreshCw size={14} /> Pinch to zoom on mobile</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-white/40 uppercase tracking-widest">
                Fractal: {fractals[fractalType].name}
                <br />
                Center: {center.x.toFixed(4)}, {center.y.toFixed(4)}
                <br />
                Zoom: {(1/zoom).toExponential(2)}x
                <br />
                Iterations: {effectiveIterations}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ControlButton 
          icon={<Info size={20} />} 
          onClick={() => setShowInfo(!showInfo)} 
          active={showInfo}
          className="pointer-events-auto"
        />
      </div>

      {/* Controls Panel */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-4 w-64 pointer-events-none">
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl pointer-events-auto space-y-4 shadow-2xl"
            >
              <div>
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/60 mb-2">
                  <span>Fractal Type</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {fractals.map(f => (
                        <button
                            key={f.id}
                            onClick={() => {
                                setFractalType(f.id);
                                if (f.id === 1) setCenter({ x: 0, y: 0 });
                                else setCenter({ x: -0.5, y: 0 });
                            }}
                            className={`text-[10px] py-2 rounded-lg border transition-all ${fractalType === f.id ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                        >
                            {f.name}
                        </button>
                    ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Detail Level</div>
                    <button 
                        onClick={() => setAutoIterations(!autoIterations)}
                        className={`text-[9px] px-2 py-0.5 rounded border ${autoIterations ? 'bg-indigo-500 border-indigo-400' : 'bg-white/5 border-white/10'}`}
                    >
                        AUTO
                    </button>
                </div>
                {!autoIterations && (
                    <input 
                        type="range" 
                        min="50" 
                        max="1000" 
                        step="10"
                        value={maxIterations}
                        onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                )}
                {autoIterations && (
                    <div className="text-[10px] text-white/40 italic">
                        Scaling with zoom: {effectiveIterations} iterations
                    </div>
                )}
              </div>

              <div>
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/60 mb-2">
                  <span>Cycle Speed</span>
                  <span>{cycleSpeed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.1"
                  value={cycleSpeed}
                  onChange={(e) => setCycleSpeed(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ControlButton: React.FC<{ 
  icon: React.ReactNode; 
  onClick: () => void; 
  label?: string;
  active?: boolean;
  className?: string;
}> = ({ icon, onClick, label, active, className }) => (
  <button
    onClick={onClick}
    className={`
      group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200
      ${active ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-white/10'}
      backdrop-blur-md border border-white/10 shadow-lg active:scale-95
      ${className}
    `}
  >
    {icon}
    {label && (
      <span className="absolute left-14 px-2 py-1 bg-black/80 text-[10px] uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    )}
  </button>
);
