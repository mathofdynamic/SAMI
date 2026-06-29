import { useEffect } from 'react';
import { buildPreviewFontHref } from '../fonts';

// Injects one stylesheet that loads every picker font (single weight) so the
// font selector and the Typography specimen page can render real typefaces.
export const FontPreloader: React.FC = () => {
  useEffect(() => {
    const id = 'sami-font-preview-link';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = buildPreviewFontHref();
    document.head.appendChild(link);
  }, []);
  return null;
};
