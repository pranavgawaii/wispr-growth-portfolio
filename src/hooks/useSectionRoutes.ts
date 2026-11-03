import { useEffect } from 'react';

const sections: Record<string, string> = {
  '/': 'hero',
  '/hero/': 'hero',
  '/main/': 'main',
  '/projects/': 'selected-work',
  '/experiment/': 'first-win',
  '/voice-lab/': 'voice-lab',
  '/tech-stack/': 'tech-stack',
  '/growth-plan/': 'growth-plan',
  '/contact/': 'wispr-contact',
  '/footer/': 'footer',
};
const legacy: Record<string, string> = {
  hero: '/',
  main: '/main/',
  'selected-work': '/projects/',
  'first-win': '/experiment/',
  'voice-lab': '/voice-lab/',
  'tech-stack': '/tech-stack/',
  'growth-plan': '/growth-plan/',
  'gp-title': '/growth-plan/',
  'wispr-contact': '/contact/',
  footer: '/footer/',
};
const canonical = (path: string) => (path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`);
const isProduct = (path: string) => path.startsWith('/one-breath/');

/** Section URLs share one document, preserving playback and interaction state. */
export function useSectionRoutes() {
  useEffect(() => {
    let frame = 0;
    const navigate = (smooth: boolean) => {
      const query = new URLSearchParams(window.location.search);
      if (query.has('product') || query.has('studio')) {
        window.location.replace('/one-breath/');
        return;
      }
      if (window.location.search) return;
      const current = canonical(window.location.pathname);
      const hash = window.location.hash.slice(1);
      const destination = isProduct(current) ? undefined : legacy[hash];
      const path = destination || current;
      if (!sections[path]) return;
      if (destination || current !== window.location.pathname)
        window.history.replaceState(window.history.state, '', path);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(sections[path]);
        target?.scrollIntoView({
          behavior:
            smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'smooth'
              : 'instant',
        });
        if (path === '/main/') target?.focus({ preventScroll: true });
      });
    };
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.search || url.hash || window.location.search)
        return;
      const path = canonical(url.pathname);
      if (
        !sections[canonical(window.location.pathname)] ||
        !sections[path] ||
        isProduct(path) !== isProduct(canonical(window.location.pathname))
      )
        return;
      event.preventDefault();
      if (window.location.pathname !== path) window.history.pushState(null, '', path);
      navigate(true);
    };
    const pop = () => navigate(false);
    navigate(false);
    document.addEventListener('click', click);
    window.addEventListener('popstate', pop);
    window.addEventListener('hashchange', pop);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('click', click);
      window.removeEventListener('popstate', pop);
      window.removeEventListener('hashchange', pop);
    };
  }, []);
}
