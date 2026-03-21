import { useEffect, useCallback } from 'react';
import { PALETTES } from '../constants/palettes';

interface UseHotkeysProps {
  zoom: number;
  zoomAt: (clientX: number, clientY: number, factor: number) => void;
  resetView: () => void;
  showPaletteMenu: boolean;
  setShowPaletteMenu: (show: boolean) => void;
  setShowFractalMenu: (show: boolean | ((prev: boolean) => boolean)) => void;
  setShowDetailMenu: (show: boolean | ((prev: boolean) => boolean)) => void;
  setShowSpeedMenu: (show: boolean | ((prev: boolean) => boolean)) => void;
  setColorScheme: (scheme: number | ((prev: number) => number)) => void;
  setCycleSpeed: (speed: number | ((prev: number) => number)) => void;
  setShowInfo: (show: boolean | ((prev: boolean) => boolean)) => void;
  setShowControls: (show: boolean | ((prev: boolean) => boolean)) => void;
  setCenter: (center: { x: number, y: number } | ((prev: { x: number, y: number }) => { x: number, y: number })) => void;
}

export const useHotkeys = ({
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
}: UseHotkeysProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    const key = e.key.toLowerCase();
    const isShift = e.shiftKey;
    const isCtrl = e.ctrlKey || e.metaKey;
    const isBoth = isShift && isCtrl;

    // Handle Palette cycling specifically
    if (e.key === 'p') {
      if (!showPaletteMenu) {
        setShowPaletteMenu(true);
        setShowFractalMenu(false);
        setShowDetailMenu(false);
        setShowSpeedMenu(false);
      } else {
        setColorScheme(prev => (prev + 1) % PALETTES.length);
      }
      return;
    }
    if (e.key === 'P') {
      setShowPaletteMenu(false);
      return;
    }

    switch (key) {
      case '+':
      case '=': {
        let factor = 0.5;
        if (isBoth) factor = 0.95;
        else if (isCtrl) factor = 0.875;
        else if (isShift) factor = 0.75;
        zoomAt(window.innerWidth / 2, window.innerHeight / 2, factor);
        break;
      }
      case '-':
      case '_': {
        let factor = 2.0;
        if (isBoth) factor = 1.05;
        else if (isCtrl) factor = 1.25;
        else if (isShift) factor = 1.5;
        zoomAt(window.innerWidth / 2, window.innerHeight / 2, factor);
        break;
      }
      case 'c':
        setCycleSpeed(prev => prev === 0 ? 1 : 0);
        break;
      case 'v': {
        let step = 0.5;
        if (isBoth) step = 0.01;
        else if (isCtrl) step = 0.125;
        else if (isShift) step = 0.25;
        setCycleSpeed(prev => Math.min(prev + step, 10));
        break;
      }
      case 'z': {
        let step = 0.5;
        if (isBoth) step = 0.01;
        else if (isCtrl) step = 0.125;
        else if (isShift) step = 0.25;
        setCycleSpeed(prev => Math.max(prev - step, 0));
        break;
      }
      case 'r':
        resetView();
        break;
      case 'f':
        setShowFractalMenu(prev => !prev);
        setShowPaletteMenu(false);
        setShowDetailMenu(false);
        setShowSpeedMenu(false);
        break;
      case 'd':
        setShowDetailMenu(prev => !prev);
        setShowFractalMenu(false);
        setShowPaletteMenu(false);
        setShowSpeedMenu(false);
        break;
      case 's':
        setShowSpeedMenu(prev => !prev);
        setShowFractalMenu(false);
        setShowPaletteMenu(false);
        setShowDetailMenu(false);
        break;
      case 'i':
        setShowInfo(prev => !prev);
        break;
      case 'h':
        setShowControls(prev => !prev);
        break;
      case 'arrowup': {
        let delta = 0.1;
        if (isBoth) delta = 0.005;
        else if (isCtrl) delta = 0.025;
        else if (isShift) delta = 0.05;
        setCenter(prev => ({ ...prev, y: prev.y - delta * zoom }));
        break;
      }
      case 'arrowdown': {
        let delta = 0.1;
        if (isBoth) delta = 0.005;
        else if (isCtrl) delta = 0.025;
        else if (isShift) delta = 0.05;
        setCenter(prev => ({ ...prev, y: prev.y + delta * zoom }));
        break;
      }
      case 'arrowleft': {
        let delta = 0.1;
        if (isBoth) delta = 0.005;
        else if (isCtrl) delta = 0.025;
        else if (isShift) delta = 0.05;
        setCenter(prev => ({ ...prev, x: prev.x - delta * zoom }));
        break;
      }
      case 'arrowright': {
        let delta = 0.1;
        if (isBoth) delta = 0.005;
        else if (isCtrl) delta = 0.025;
        else if (isShift) delta = 0.05;
        setCenter(prev => ({ ...prev, x: prev.x + delta * zoom }));
        break;
      }
    }
  }, [zoom, zoomAt, resetView, showPaletteMenu, setShowPaletteMenu, setShowFractalMenu, setShowDetailMenu, setShowSpeedMenu, setColorScheme, setCycleSpeed, setShowInfo, setShowControls, setCenter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
