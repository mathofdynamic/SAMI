import { useEffect } from 'react';
import { buildFarsiFontFaceCss } from '../farsiFonts';

// Injects one <style> tag holding every Persian @font-face. The declarations
// don't trigger a download until a family is referenced, so mounting this
// always (regardless of language) is cheap; the FA-only picker decides which
// families a user can actually pick.
export const FarsiFontLoader: React.FC = () => {
  useEffect(() => {
    const id = 'sami-farsi-fonts';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = buildFarsiFontFaceCss();
    document.head.appendChild(style);
  }, []);
  return null;
};
