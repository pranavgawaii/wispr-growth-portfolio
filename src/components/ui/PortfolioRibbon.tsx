import { useId, useLayoutEffect, useState, useRef } from 'react';

/** A viewport-wide speech ribbon passing through the Voice Lab waveform. */
export function PortfolioRibbon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [periods, setPeriods] = useState({ raw: 800, clean: 700 });
  const id = useId().replace(/:/g, '');
  const [layout, setLayout] = useState({ width: 0, entry: 0 });
  useLayoutEffect(() => {
    const slot = svgRef.current?.parentElement;
    if (!slot) return;
    const measure = () =>
      setLayout((previous) => ({
        ...previous,
        width: window.innerWidth,
        entry: slot.getBoundingClientRect().left,
      }));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slot);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  useLayoutEffect(() => {
    if (!layout.width) return;
    let active = true;
    const measure = () => {
      if (!active || !svgRef.current) return;
      const raw = svgRef.current.querySelector<SVGTextElement>('.ribbon-measure-raw');
      const clean = svgRef.current.querySelector<SVGTextElement>('.ribbon-measure-clean');
      if (raw && clean)
        setPeriods({
          raw: raw.getComputedTextLength() + 24,
          clean: clean.getComputedTextLength() + 24,
        });
    };
    measure();
    document.fonts.ready.then(measure);
    return () => {
      active = false;
    };
  }, [layout.width]);
  const width = layout.width || 800;
  const height = 315;
  const center = width / 2;
  const roomy = width >= 1100;
  const loop = Math.max(65, (width - 800) / 4);
  const raw = roomy
    ? `M-900 -15 L${loop - 45} -15 C${loop + 130} -15 ${loop + 110} -210 ${loop} -190 C${loop - 110} -165 ${loop - 75} 8 ${loop + 25} 25 C${loop + 90} 42 ${center - 120} 43 ${center} 43`
    : `M-900 28 L-20 28 C${width * 0.16} -20 ${width * 0.2} 85 ${width * 0.32} 51 C${width * 0.4} 43 ${center - 55} 43 ${center} 43`;
  const clean = `M${center} 43 C${center + width * 0.17} 43 ${width * 0.85} 22 ${width + 25} 5 L${width + 900} 5`;
  const rawPeriod = periods.raw;
  const cleanPeriod = periods.clean;
  return (
    <div
      className="ribbon-connection-slot local-voice-ribbon"
      aria-label="Prepared illustration of repetition being removed from spoken words."
    >
      <span className="cleanup-pill">
        <span>
          <s>the the</s> → the
        </span>
        <span>
          <s>probably going to</s> → might
        </span>
      </span>
      <div className="ribbon-wave-front" aria-hidden="true">
        {Array.from({ length: 19 }, (_, i) => (
          <i
            key={i}
            style={{
              height: `${5 + Math.abs(Math.sin(i * 1.6)) * 25}px`,
              animationDelay: `${i * 0.06}s`,
            }}
          />
        ))}
      </div>
      <svg
        aria-hidden="true"
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 -220 ${width} ${height}`}
      >
        <text className="ribbon-measure-raw" visibility="hidden">
          I told the team the the new timeline should be ready by Friday, although it’s probably
          going to slip.
        </text>
        <text className="ribbon-measure-clean" visibility="hidden">
          I told the team the new timeline should be ready by Friday, although it might slip.
        </text>
        <defs>
          <clipPath id={`${id}-outside`}>
            <rect x="-1000" y="-230" width={layout.entry + 1000} height="340" />
          </clipPath>
          <clipPath id={`${id}-inside`}>
            <rect x={layout.entry} y="-230" width={width} height="340" />
          </clipPath>
          <linearGradient
            id={`${id}-entry-fade`}
            gradientUnits="userSpaceOnUse"
            x1={center - 110}
            x2={center - 34}
          >
            <stop offset="0" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </linearGradient>
          <mask
            id={`${id}-entry-mask`}
            maskUnits="userSpaceOnUse"
            x="-1000"
            y="-230"
            width={width + 2000}
            height="340"
          >
            <rect
              x="-1000"
              y="-230"
              width={width + 2000}
              height="340"
              fill={`url(#${id}-entry-fade)`}
            />
          </mask>
          <path id={`${id}-raw`} d={raw} />
          <path id={`${id}-clean`} d={clean} />
        </defs>
        <text
          className="connected-ribbon-text connected-ribbon-raw ribbon-outside"
          clipPath={`url(#${id}-outside)`}
        >
          <textPath href={`#${id}-raw`} startOffset={-rawPeriod}>
            {Array.from({ length: Math.ceil(height / rawPeriod) + 4 }, (_, i) => (
              <tspan key={i} dx="24">
                I told the team <tspan className="connected-filler">the the</tspan> new timeline
                should be ready by Friday, although it’s{' '}
                <tspan className="connected-filler">probably going to</tspan> slip.
              </tspan>
            ))}
            <animate
              attributeName="startOffset"
              from={-rawPeriod}
              to="0"
              dur={`${rawPeriod / 32}s`}
              repeatCount="indefinite"
            />
          </textPath>
        </text>
        <text
          className="connected-ribbon-text connected-ribbon-raw ribbon-inside"
          clipPath={`url(#${id}-inside)`}
          mask={`url(#${id}-entry-mask)`}
        >
          <textPath href={`#${id}-raw`} startOffset={-rawPeriod}>
            {Array.from({ length: Math.ceil(height / rawPeriod) + 4 }, (_, i) => (
              <tspan key={i} dx="24">
                I told the team <tspan className="connected-filler">the the</tspan> new timeline
                should be ready by Friday, although it’s{' '}
                <tspan className="connected-filler">probably going to</tspan> slip.
              </tspan>
            ))}
            <animate
              attributeName="startOffset"
              from={-rawPeriod}
              to="0"
              dur={`${rawPeriod / 32}s`}
              repeatCount="indefinite"
            />
          </textPath>
        </text>
        <use href={`#${id}-clean`} className="voice-output-ribbon" />
        <text className="connected-ribbon-text connected-ribbon-clean">
          <textPath href={`#${id}-clean`} startOffset={-cleanPeriod}>
            {Array.from({ length: Math.ceil(height / cleanPeriod) + 4 }, (_, i) => (
              <tspan key={i} dx="24">
                I told the team the new timeline should be ready by Friday, although it might slip.
              </tspan>
            ))}
            <animate
              attributeName="startOffset"
              from={-cleanPeriod}
              to="0"
              dur={`${cleanPeriod / 32}s`}
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  );
}
