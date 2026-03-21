import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Cpu, Zap, Target } from 'lucide-react';

interface InfoOverlayProps {
  show: boolean;
  center: { x: number, y: number };
  zoom: number;
  iterations: number;
  isAtPrecisionLimit: boolean;
}

export const InfoOverlay: React.FC<InfoOverlayProps> = ({ 
  show, 
  center, 
  zoom, 
  iterations,
  isAtPrecisionLimit
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute bottom-24 right-8 bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl z-50 min-w-[280px]"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Info size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">Fractal Science</h3>
              <p className="text-[9px] text-white/40 font-medium">Real-time Computation Data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-widest font-bold">
                <Target size={10} />
                Coordinates
              </div>
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-white/20 uppercase">Real (X)</span>
                  <span className="text-[10px] font-mono text-white truncate">{center.x.toFixed(14)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-white/20 uppercase">Imaginary (Y)</span>
                  <span className="text-[10px] font-mono text-white truncate">{center.y.toFixed(14)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-widest font-bold">
                  <Zap size={10} />
                  Resolution
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] font-mono text-white">
                    {(1 / zoom).toExponential(2)}x
                  </div>
                  <div className="text-[8px] text-white/20 mt-1 uppercase">Magnification</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-widest font-bold">
                  <Cpu size={10} />
                  Compute
                </div>
                <div className={`bg-white/5 p-3 rounded-xl border transition-colors ${isAtPrecisionLimit ? 'border-red-500/30 bg-red-500/5' : 'border-white/5'}`}>
                  <div className={`text-[10px] font-mono ${isAtPrecisionLimit ? 'text-red-400' : 'text-white'}`}>
                    {iterations.toLocaleString()}
                  </div>
                  <div className="text-[8px] text-white/20 mt-1 uppercase">Steps</div>
                </div>
              </div>
            </div>
          </div>

          {isAtPrecisionLimit && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-[9px] text-red-400 font-medium leading-relaxed">
                <span className="font-bold uppercase mr-1">Warning:</span> 
                Floating point precision limit reached. Mathematical artifacts may appear.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
