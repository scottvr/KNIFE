import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useSmartPosition } from '../../hooks/useSmartPosition';

interface SpeedMenuProps {
  cycleSpeed: number;
  setCycleSpeed: (val: number) => void;
}

export const SpeedMenu: React.FC<SpeedMenuProps> = ({
  cycleSpeed,
  setCycleSpeed,
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
      className="absolute left-[calc(5.5rem+env(safe-area-inset-left,0px))] top-[calc(18rem+env(safe-area-inset-top,0px))] bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-col gap-4 min-w-[200px] shadow-2xl z-50 pointer-events-auto"
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Cycle Speed</span>
          <span className="text-[10px] font-mono">{cycleSpeed.toFixed(2)}x</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1"
          value={cycleSpeed}
          onChange={(e) => setCycleSpeed(parseFloat(e.target.value))}
          className="w-full accent-white"
        />
        <div className="flex gap-1">
          {[0, 0.5, 1, 2].map(s => (
            <button 
              key={s}
              onClick={() => setCycleSpeed(s)}
              className={`flex-1 text-[9px] py-1 rounded border transition-colors ${cycleSpeed === s ? 'bg-white text-black border-white' : 'border-white/20 text-white/40'}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
