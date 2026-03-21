import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { PALETTES } from '../../constants/palettes';
import { useSmartPosition } from '../../hooks/useSmartPosition';

interface PaletteMenuProps {
  colorScheme: number;
  setColorScheme: (id: number) => void;
}

export const PaletteMenu: React.FC<PaletteMenuProps> = ({ colorScheme, setColorScheme }) => {
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
      className="absolute left-14 top-0 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col gap-1 min-w-[120px] shadow-2xl z-50"
    >
      {PALETTES.map(p => (
        <button
          key={p.id}
          onClick={() => setColorScheme(p.id)}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left ${
            colorScheme === p.id 
              ? "bg-white/20 text-white shadow-inner" 
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          {p.name}
        </button>
      ))}
    </motion.div>
  );
};
