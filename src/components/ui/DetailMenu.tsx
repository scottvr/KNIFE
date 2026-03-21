import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useSmartPosition } from '../../hooks/useSmartPosition';

interface DetailMenuProps {
  effectiveIterations: number;
  maxIterations: number;
  setMaxIterations: (val: number) => void;
  autoIterations: boolean;
  setAutoIterations: (val: boolean) => void;
}

export const DetailMenu: React.FC<DetailMenuProps> = ({
  effectiveIterations,
  maxIterations,
  setMaxIterations,
  autoIterations,
  setAutoIterations,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { yOffset } = useSmartPosition(menuRef);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        y: yOffset 
      }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute left-[calc(5.5rem+env(safe-area-inset-left,0px))] top-[calc(14.5rem+env(safe-area-inset-top,0px))] bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-col gap-4 min-w-[200px] shadow-2xl z-50 pointer-events-auto"
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Iterations</span>
          <span className="text-[10px] font-mono">{effectiveIterations}</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="2000" 
          step="50"
          value={maxIterations}
          onChange={(e) => {
            setMaxIterations(parseInt(e.target.value));
            setAutoIterations(false);
          }}
          className="w-full accent-white"
        />
        <button 
          onClick={() => setAutoIterations(!autoIterations)}
          className={`text-[9px] px-2 py-1 rounded border transition-colors ${autoIterations ? 'bg-white text-black border-white' : 'border-white/20 text-white/40'}`}
        >
          Auto-Scale: {autoIterations ? 'ON' : 'OFF'}
        </button>
      </div>
    </motion.div>
  );
};
