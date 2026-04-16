'use client';

import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top  = `${my}px`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = `${rx}px`;
      ring.style.top  = `${ry}px`;
      raf = requestAnimationFrame(loop);
    };

    const over = () => ring.classList.add('hovered');
    const out  = () => ring.classList.remove('hovered');

    const attachEvents = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', over);
        el.addEventListener('mouseleave', out);
      });
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    attachEvents();

    const mo = new MutationObserver(attachEvents);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="c-dot  hidden md:block" />
      <div ref={ringRef} className="c-ring hidden md:block" />
    </>
  );
}
