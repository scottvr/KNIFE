import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { FRACTAL_CATEGORIES } from '../../constants/fractals';
import { useSmartPosition } from '../../hooks/useSmartPosition';

interface FractalMenuProps {
  fractalType: number;
  setFractalType: (id: number) => void;
  expandedCategory: string | null;
  setExpandedCategory: (name: string | null) => void;
  setCenter: (center: { x: number, y: number }) => void;
  setZoom: (zoom: number) => void;
  onClose: () => void;
}

export const FractalMenu: React.FC<FractalMenuProps> = ({
  fractalType,
  setFractalType,
  expandedCategory,
  setExpandedCategory,
  setCenter,
  setZoom,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { yOffset } = useSmartPosition(menuRef, [expandedCategory]);

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
      className="absolute left-14 top-0 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col gap-1 min-w-[160px] shadow-2xl z-50"
    >
      {FRACTAL_CATEGORIES.map(cat => (
        <div key={cat.name} className="flex flex-col">
          <button
            onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 flex justify-between items-center ${
              expandedCategory === cat.name 
                ? "text-indigo-400 bg-white/5" 
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {cat.name}
            <ChevronRight size={12} className={`transition-transform duration-300 ${expandedCategory === cat.name ? "rotate-90" : ""}`} />
          </button>
          
          {expandedCategory === cat.name && (
            <div className="flex flex-col gap-1 mt-1 pl-2">
              {cat.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    setFractalType(v.id);
                    if (v.id === 1) {
                      setCenter({ x: 0, y: 0 });
                      setZoom(3.0);
                    } else {
                      setCenter({ x: -0.5, y: 0 });
                      setZoom(3.0);
                    }
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left ${
                    fractalType === v.id 
                      ? "bg-white/20 text-white shadow-inner" 
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};
