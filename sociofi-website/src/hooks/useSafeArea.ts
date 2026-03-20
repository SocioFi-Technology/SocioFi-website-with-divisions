import { useState, useEffect } from 'react';

export function useSafeArea() {
  const [insets, setInsets] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; pointer-events: none;
      top: env(safe-area-inset-top, 0px);
      bottom: env(safe-area-inset-bottom, 0px);
      left: env(safe-area-inset-left, 0px);
      right: env(safe-area-inset-right, 0px);
    `;
    // Use CSS custom properties to read safe area values
    const style = getComputedStyle(document.documentElement);
    const top = parseInt(style.getPropertyValue('--sat') || '0');
    const bottom = parseInt(style.getPropertyValue('--sab') || '0');
    setInsets({ top, bottom, left: 0, right: 0 });
  }, []);

  return insets;
}
