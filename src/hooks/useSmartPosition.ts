import { useState, useLayoutEffect, RefObject } from 'react';

interface Position {
  yOffset: number;
}

/**
 * A hook that calculates a vertical offset to keep an element within the viewport.
 * Useful for absolute-positioned menus that might overflow the bottom of the screen.
 */
export const useSmartPosition = (
  ref: RefObject<HTMLElement | null>,
  dependencies: any[] = []
): Position => {
  const [yOffset, setYOffset] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Reset offset to measure natural position
    setYOffset(0);

    // Use requestAnimationFrame to ensure the DOM has updated (especially for animations)
    const handle = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const padding = 16; // Safety margin from screen edge

      if (rect.bottom > viewportHeight - padding) {
        const overflow = rect.bottom - (viewportHeight - padding);
        setYOffset(-overflow);
      } else {
        setYOffset(0);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, [ref, ...dependencies]);

  return { yOffset };
};
