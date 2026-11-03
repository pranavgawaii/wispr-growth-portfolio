import React, { useEffect, useState } from 'react';

export const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('portfolio-theme', next ? 'dark' : 'light');
    } catch {
      /* In-memory preference fallback */
    }
  };

  return (
    <div className="theme-controls">
      <button
        type="button"
        onClick={toggle}
        className={`eclipse-toggle ${dark ? 'is-night' : ''}`}
        aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={dark ? 'Light mode' : 'Dark mode'}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="7.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 4.25a7.75 7.75 0 0 1 0 15.5V4.25Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};
