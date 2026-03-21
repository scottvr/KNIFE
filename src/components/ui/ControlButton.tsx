import React from 'react';
import { motion } from 'motion/react';

interface ControlButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}

export const ControlButton: React.FC<ControlButtonProps> = ({ icon, onClick, active, label }) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all duration-300 ${
      active 
        ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
        : "bg-black/40 border-white/10 text-white/70 hover:text-white"
    }`}
    title={label}
  >
    {icon}
  </motion.button>
);
