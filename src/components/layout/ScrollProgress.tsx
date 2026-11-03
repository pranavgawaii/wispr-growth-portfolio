import React, { useEffect, useRef } from 'react';
export const ScrollProgress: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const draw = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <div
      ref={ref}
      id="pr"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-stone-900 dark:bg-stone-100 origin-left z-50 pointer-events-none"
      style={{ transform: 'scaleX(0)' }}
    />
  );
};
