import { useEffect } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

export function NotFound() {
  useEffect(() => {
    document.title = 'Page not found | Pranav Gawai';
  }, []);

  return (
    <main className="not-found">
      <header className="not-found-header">
        <a href="/">Pranav Gawai</a>
        <ThemeToggle />
      </header>
      <section className="not-found-content" aria-labelledby="not-found-title">
        <span className="not-found-number" aria-hidden="true">
          404
        </span>
        <p className="not-found-label">A little off the path</p>
        <h1 id="not-found-title">Let’s find your way back.</h1>
        <p>This page has moved or doesn’t exist. There’s still plenty to explore.</p>
        <div className="not-found-links">
          <a href="/">Back to portfolio</a>
          <a href="/one-breath/">Play One Breath</a>
        </div>
      </section>
      <footer>Good ideas are worth finding.</footer>
    </main>
  );
}
