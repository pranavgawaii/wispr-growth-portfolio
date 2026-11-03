import React, { useId } from 'react';

const RIVER_PATH =
  'M740 270c-90 25 94 34 22 64-71 30-221 23-192 86h267c-128-59 27-69-20-101-35-24-130-26-77-49Z';

export const Footer: React.FC<{ product?: boolean }> = ({ product = false }) => {
  const id = useId().replace(/:/g, '');
  return (
    <footer
      id="footer"
      className="scenery-footer"
      aria-label={product ? 'One Breath footer' : 'Portfolio footer'}
    >
      <div className="scenery-footer-copy">
        <div className="scenery-footer-meta">
          <span className="scenery-meta-left">
            © {new Date().getFullYear()} {product ? 'One Breath · by Pranav' : 'Pranav Gawai'}
          </span>
          <a
            href={product ? '/experiment/' : 'mailto:pranavgawai1518@gmail.com'}
            className="group/say scenery-meta-center inline-flex items-center font-bold text-inherit underline decoration-current/40 underline-offset-4 hover:decoration-current transition-colors select-none whitespace-nowrap !no-underline hover:!underline"
          >
            <span className="relative inline-block align-[-2px] w-3.5 h-3.5 mr-1 shrink-0">
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-150 opacity-100 scale-100 group-hover/say:opacity-0 group-hover/say:-translate-y-0.5 group-hover/say:translate-x-0.5 pointer-events-none">
                <svg
                  className="w-3.5 h-3.5 stroke-current stroke-[1.8] fill-none"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-150 opacity-0 scale-75 group-hover/say:opacity-100 group-hover/say:scale-100 pointer-events-none">
                <svg
                  className="w-3.5 h-3.5 stroke-current stroke-[2.2] fill-none"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </span>
            <span>{product ? 'Back to the portfolio' : 'Say hello!!'}</span>
          </a>
          <span className="scenery-availability scenery-meta-right">
            <i aria-hidden="true" />
            {product ? 'An independent voice experiment' : 'Open to build at Wispr'}
          </span>
        </div>
        <p>
          {product
            ? 'A little more flow. A little less overthinking.'
            : 'A little further from the screen.'}
        </p>
      </div>
      <div className="scenery-illustration" aria-hidden="true">
        <svg
          viewBox="0 0 1440 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <defs>
            <pattern
              id={`${id}-hatch`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(28)"
            >
              <path d="M0 0V8" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <pattern id={`${id}-dots`} width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
            <clipPath id={`${id}-sun`}>
              <circle cx="1000" cy="117" r="65" />
            </clipPath>
            <clipPath id={`${id}-river`}>
              <path d={RIVER_PATH} />
            </clipPath>
            <pattern id={`${id}-ripples`} width="64" height="22" patternUnits="userSpaceOnUse">
              <path
                d="M-8 9Q8 4 24 9T56 9T88 9"
                stroke="currentColor"
                strokeWidth="1"
                opacity=".35"
              />
            </pattern>
          </defs>
          <g className="scenery-solar">
            <circle cx="1000" cy="117" r="65" className="scenery-sun-warmth" />
            <circle cx="1000" cy="117" r="76" className="scenery-sun-halo" />
            <circle cx="1000" cy="117" r="87" className="scenery-sun-halo scenery-sun-halo-outer" />
            <g className="scenery-sun" clipPath={`url(#${id}-sun)`}>
              <circle cx="1000" cy="117" r="65" fill={`url(#${id}-dots)`} />
            </g>
          </g>
          <g
            className="scenery-clouds"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          >
            {[-1440, 0, 1440].map((offset) => (
              <g key={offset} transform={`translate(${offset} 0)`}>
                <path d="M148 100h93m-77-7h42m-20 15h72M1110 63h89m-65-8h43m-15 16h56" />
              </g>
            ))}
          </g>
          <g
            className="scenery-birds"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <path d="M704 91q9-8 18 0q9-8 18 0m42-21q6-6 12 0q6-6 12 0" />
          </g>
          <path
            className="scenery-far"
            d="M0 255 97 216 165 220 260 169 338 169 388 217 464 195 538 209 607 162 668 162 729 215 821 191 882 204 959 178 1057 178 1136 230 1258 192 1342 204 1440 245V420H0Z"
          />
          <path
            className="scenery-ridge"
            d="M0 255 97 216 165 220 260 169 338 169 388 217 464 195 538 209 607 162 668 162 729 215 821 191 882 204 959 178 1057 178 1136 230 1258 192 1342 204 1440 245"
          />
          <path
            className="scenery-middle"
            d="M0 289 127 250 227 259 317 218 415 218 491 265 614 245 727 263 842 236 908 245 1003 218 1102 218 1191 273 1303 246 1440 286V420H0Z"
          />
          <path
            className="scenery-ridge"
            d="M0 289 127 250 227 259 317 218 415 218 491 265 614 245 727 263 842 236 908 245 1003 218 1102 218 1191 273 1303 246 1440 286"
          />
          <path
            className="scenery-hatching"
            d="m227 259 90-41h98l76 47-72-20-58-12-44 10Zm615-23 66 9 95-27h99l89 55-96-32-70-10-47 14Z"
            fill={`url(#${id}-hatch)`}
          />
          <path
            className="scenery-near"
            d="M0 330q133-62 267-23t240 9q126-33 214-23t204 23q144-80 294-19t221 15v108H0Z"
          />
          <path className="scenery-river" d={RIVER_PATH} />
          <g clipPath={`url(#${id}-river)`}>
            <rect
              className="scenery-river-current"
              x="540"
              y="240"
              width="320"
              height="220"
              fill={`url(#${id}-ripples)`}
            />
          </g>
          <g
            className="scenery-water"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          >
            {['M721 291h29', 'M753 316h36', 'M681 361h63', 'M638 387h80', 'M613 409h119'].map(
              (line, index) => (
                <path key={line} d={line} style={{ animationDelay: `${index * -0.9}s` }} />
              ),
            )}
          </g>
          <g
            className="scenery-contours"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <path d="M0 347q128-57 246-20t211 17m-457 25q115-47 230-18t173 18M0 394q114-42 206-12m719-48q144-59 285-14t230 14m-477 23q130-42 259-9t218 10m-417 20q114-22 220 3t197 2m-357 20q97-7 174 10" />
          </g>
          <g className="scenery-trees" fill="currentColor">
            {[
              { x: 110, y: 336, s: 1 },
              { x: 142, y: 343, s: 0.7 },
              { x: 1250, y: 327, s: 1.1 },
              { x: 1282, y: 335, s: 0.8 },
            ].map(({ x, y, s }) => (
              <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
                <path
                  className="scenery-tree-breeze"
                  d="M-1 3V-27h2V3Zm-16-20 11-14-6 1L0-48l12 18-6-1 11 14-9-2 14 15h-44l14-15Z"
                />
              </g>
            ))}
          </g>
          <path d="M0 419H1440" stroke="currentColor" />
        </svg>
      </div>
    </footer>
  );
};
