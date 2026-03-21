import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Palette, Layers, Sliders, Gauge, Info, HelpCircle, Monitor } from 'lucide-react';
import { ControlButton } from './ui/ControlButton';
import { PaletteMenu } from './ui/PaletteMenu';
import { FractalMenu } from './ui/FractalMenu';
import { DetailMenu } from './ui/DetailMenu';
import { SpeedMenu } from './ui/SpeedMenu';
import { InfoOverlay } from './ui/InfoOverlay';
import { useHotkeys } from '../hooks/useHotkeys';
import { useMandelbrotRenderer } from '../hooks/useMandelbrotRenderer';
import { PALETTES } from '../constants/palettes';

export const MandelbrotExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for view parameters
  const [center, setCenter] = useState({ x: -0.5, y: 0 });
  const [zoom, setZoom] = useState(3.0);
  const [maxIterations, setMaxIterations] = useState(150);
  const [autoIterations, setAutoIterations] = useState(true);
  const [colorScheme, setColorScheme] = useState(0);
  const [fractalType, setFractalType] = useState(0);
  const [juliaC, setJuliaC] = useState({ x: -0.8, y: 0.156 });
  const [cycleSpeed, setCycleSpeed] = useState(0.0);
  const [isHiRes, setIsHiRes] = useState(true);
  const resolutionScale = isHiRes ? (window.devicePixelRatio || 1) : 1;
  
  // UI State
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);
  const [showFractalMenu, setShowFractalMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showDetailMenu, setShowDetailMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Standard");

  const resetView = useCallback(() => {
    if (fractalType === 1) {
      setCenter({ x: 0, y: 0 });
    } else {
      setCenter({ x: -0.5, y: 0 });
    }
    setZoom(3.0);
    setMaxIterations(150);
  }, [fractalType]);

  const { effectiveIterations, isAtPrecisionLimit } = useMandelbrotRenderer({
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
  });

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

  useHotkeys({
    zoom,
    zoomAt,
    resetView,
    showPaletteMenu,
    setShowPaletteMenu,
    setShowFractalMenu,
    setShowDetailMenu,
    setShowSpeedMenu,
    setColorScheme,
    setCycleSpeed,
    setShowInfo,
    setShowControls,
    setCenter,
  });

  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const mouseDownTimeRef = useRef<number>(0);
  const mouseDownPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

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
      <div className="absolute top-[calc(1.5rem+env(safe-area-inset-top,0px))] left-[calc(1.5rem+env(safe-area-inset-left,0px))] flex flex-col gap-4 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl pointer-events-auto min-w-[240px]"
        >
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-xl font-bold tracking-tight">KNIFE</h1>
            <div className="flex flex-col items-end gap-1">
                <div className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    Steps: {effectiveIterations.toLocaleString()}
                </div>
                <div className="text-[9px] font-mono text-indigo-400/40 px-2">
                    Prec: {Math.abs(Math.log10(zoom)).toFixed(1)} digits
                </div>
            </div>
          </div>
          <p className="text-[10px] text-white/60 uppercase tracking-wider font-medium">
            Kapaw & Nico's Infinite Fractal Explorer
          </p>
        </motion.div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <ControlButton icon={<RefreshCw size={20} />} onClick={resetView} label="Reset View" />
          
          <div className="relative">
            <ControlButton 
                icon={<Palette size={20} />} 
                onClick={() => {
                    setShowPaletteMenu(!showPaletteMenu);
                    setShowFractalMenu(false);
                    setShowDetailMenu(false);
                    setShowSpeedMenu(false);
                }} 
                active={showPaletteMenu}
                label="Palettes" 
            />
            <AnimatePresence>
              {showPaletteMenu && (
                <PaletteMenu 
                    colorScheme={colorScheme}
                    setColorScheme={(id) => {
                        setColorScheme(id);
                        setShowPaletteMenu(false);
                    }}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <ControlButton 
                icon={<Layers size={20} />} 
                onClick={() => {
                    setShowFractalMenu(!showFractalMenu);
                    setShowPaletteMenu(false);
                    setShowDetailMenu(false);
                    setShowSpeedMenu(false);
                }} 
                active={showFractalMenu}
                label="Fractals" 
            />
            <AnimatePresence>
              {showFractalMenu && (
                <FractalMenu 
                    fractalType={fractalType}
                    setFractalType={setFractalType}
                    expandedCategory={expandedCategory}
                    setExpandedCategory={setExpandedCategory}
                    setCenter={setCenter}
                    setZoom={setZoom}
                    onClose={() => setShowFractalMenu(false)}
                />
              )}
            </AnimatePresence>
          </div>

          <ControlButton 
            icon={<Sliders size={20} />} 
            onClick={() => {
                setShowDetailMenu(!showDetailMenu);
                setShowFractalMenu(false);
                setShowPaletteMenu(false);
                setShowSpeedMenu(false);
            }} 
            active={showDetailMenu}
            label="Detail" 
          />

          <ControlButton 
            icon={<Gauge size={20} />} 
            onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowFractalMenu(false);
                setShowPaletteMenu(false);
                setShowDetailMenu(false);
            }} 
            active={showSpeedMenu}
            label="Speed" 
          />

          <ControlButton 
            icon={<Monitor size={20} />} 
            onClick={() => setIsHiRes(!isHiRes)} 
            active={isHiRes}
            label="Hi-Res" 
          />
        </div>
      </div>

      {/* Menus and Overlays */}
      <AnimatePresence>
        {showDetailMenu && (
          <DetailMenu 
            effectiveIterations={effectiveIterations}
            maxIterations={maxIterations}
            setMaxIterations={setMaxIterations}
            autoIterations={autoIterations}
            setAutoIterations={setAutoIterations}
          />
        )}

        {showSpeedMenu && (
          <SpeedMenu 
            cycleSpeed={cycleSpeed}
            setCycleSpeed={setCycleSpeed}
          />
        )}
      </AnimatePresence>

      <InfoOverlay 
        show={showInfo} 
        center={center} 
        zoom={zoom} 
        iterations={effectiveIterations}
        isAtPrecisionLimit={isAtPrecisionLimit}
      />

      {/* Help Overlay */}
      <AnimatePresence>
        {isAtPrecisionLimit && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500/20 backdrop-blur-md border border-red-500/50 px-4 py-2 rounded-full text-[10px] font-medium tracking-wide text-red-200 flex items-center gap-2"
            >
                <Info size={14} />
                PRECISION LIMIT REACHED
            </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <ControlButton 
            icon={<Info size={20} />} 
            onClick={() => setShowInfo(!showInfo)} 
            active={showInfo}
            label="Info"
        />
      </div>
    </div>
  );
};
