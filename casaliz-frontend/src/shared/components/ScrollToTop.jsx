import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePublicMotion } from '../motion/publicMotionContext';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const { scrollTo } = usePublicMotion();
  const previousPath = useRef(null);

  useLayoutEffect(() => {
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (hash) {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); }
      catch { id = hash.slice(1); }
      const element = document.getElementById(id);
      if (element) scrollTo(element, { immediate: changedPage });
      else if (changedPage) scrollTo(0, { immediate: true });
      return;
    }

    if (changedPage) scrollTo(0, { immediate: true });
  }, [pathname, hash, scrollTo]);

  return null;
};

export default ScrollToTop;
