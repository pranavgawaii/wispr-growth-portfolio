import { AnimatedLink } from '../ui/AnimatedLink';
import React, { useEffect, useRef } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import avatarImg from '../../assets/avatar.webp';
import iitMandiLogo from '../../assets/iitmandi.webp';
import craftaStudioLogo from '../../assets/craftastudio.webp';
import yesBossLogo from '../../assets/yesboss.webp';
import placeproLogoTight from '../../assets/placepro-logo-tight.webp';
import falertLogo from '../../assets/falert-logo.webp';
import adobeLogoImg from '../../assets/adobe-logo.webp';

interface CompanyLinkProps {
  name: string;
  href?: string;
  logo: React.ReactNode;
}

const CompanyLink: React.FC<CompanyLinkProps> = ({ name, href, logo }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/comp inline-flex items-center gap-2 text-xs sm:text-[14px] font-semibold text-[#13261D] hover:text-[#1F6B45] transition-colors select-none whitespace-nowrap"
    >
      <div className="relative w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center flex-shrink-0">
        <div className="absolute inset-0 w-[18px] h-[18px] flex items-center justify-center transition-all duration-200 opacity-100 scale-100 group-hover/comp:opacity-0 group-hover/comp:scale-50 pointer-events-none">
          {logo}
        </div>
        <div className="absolute inset-0 w-[18px] h-[18px] flex items-center justify-center transition-all duration-200 opacity-0 scale-50 group-hover/comp:opacity-100 group-hover/comp:scale-100 pointer-events-none text-[#13261D]">
          <svg
            className="w-3.5 h-3.5 stroke-current stroke-[2.2] fill-none transition-transform duration-200 group-hover/comp:-translate-y-0.5 group-hover/comp:translate-x-0.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>
      <span className="group-hover/comp:underline underline-offset-4 decoration-[#13261D]/40 transition-all">
        {name}
      </span>
    </a>
  ) : (
    <span className="inline-flex items-center gap-2 text-xs sm:text-[14px] font-semibold text-[#13261D] select-none whitespace-nowrap">
      {logo}
      <span>{name}</span>
    </span>
  );

interface InlineEntityLinkProps {
  name: string;
  href: string;
  logo: React.ReactNode;
}

const InlineEntityLink: React.FC<InlineEntityLinkProps> = ({ name, href, logo }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group/entity inline font-bold text-[#13261D] hover:underline underline-offset-4 decoration-[#13261D]/40 transition-colors select-none whitespace-nowrap"
  >
    <span className="relative inline-block align-[-2px] w-3.5 h-3.5 mr-1 shrink-0">
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-180 opacity-100 scale-100 group-hover/entity:opacity-0 group-hover/entity:-translate-y-0.5 group-hover/entity:translate-x-0.5 pointer-events-none">
        {logo}
      </span>
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-180 opacity-0 scale-75 group-hover/entity:opacity-100 group-hover/entity:scale-100 pointer-events-none text-[#13261D]">
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
    <span>{name}</span>
  </a>
);

interface SocialItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pranavgawai/',
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M8 11v5" />
        <path d="M8 8v.01" />
        <path d="M12 16v-5" />
        <path d="M16 16v-3a2 2 0 0 0-4 0" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/pranavgawai_',
    icon: (
      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/pranavgawaii',
    icon: (
      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:pranavgawai1518@gmail.com',
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="16" x="2" y="4" rx="3" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export const HeroSection: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const phraseRef = useRef<HTMLSpanElement>(null);
  const knotRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ─── Scroll-driven Knot-to-Underline Animation ─────────────────────────────
  useEffect(() => {
    const heading = headingRef.current;
    const phrase = phraseRef.current;
    const knotAnchor = knotRef.current;
    const svg = svgRef.current;
    if (!heading || !phrase || !knotAnchor || !svg) return;

    let frame = 0;
    let current = 0;
    let previousTime = 0;
    let distance = 160;
    let drawInk: ((t: number) => void) | null = null;

    const TRACE_D =
      'M32 266 C112 270 174 190 259 206 C343 218 365 285 427 276 C510 264 583 164 558 127 C537 96 478 80 447 119 C390 191 481 210 568 235 C667 265 728 253 738 187 C751 109 668 77 612 120 C549 165 534 242 550 311 C566 380 637 385 681 334 C728 280 711 197 662 151 C619 109 546 116 466 142 C387 166 400 243 450 278 C501 315 592 319 626 281 C667 236 612 183 551 156 C484 124 451 163 432 235 C409 319 450 345 511 331 C577 316 657 219 667 151 C680 79 623 52 574 86 C529 117 480 195 491 235 C503 282 635 316 758 272';

    const trace = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    trace.setAttribute('d', TRACE_D);
    const traceLength = trace.getTotalLength();
    const SAMPLES_COUNT = 220;

    function render() {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      previousTime = 0;

      const box = heading!.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(phrase!);

      const rows: { left: number; right: number; bottom: number }[] = [];
      Array.from(range.getClientRects()).forEach((rect) => {
        if (!rect.width) return;
        const row = rows.find((r) => Math.abs(r.bottom - rect.bottom) < 6);
        if (row) {
          row.left = Math.min(row.left, rect.left);
          row.right = Math.max(row.right, rect.right);
        } else {
          rows.push({ left: rect.left, right: rect.right, bottom: rect.bottom });
        }
      });

      const knotScale = window.innerWidth <= 640 ? 0.112 : 0.138;
      const knotBox = knotAnchor!.getBoundingClientRect();
      const originX = knotBox.left - box.left + knotBox.width / 2;
      const originY = knotBox.top - box.top + knotBox.height / 2;

      const samples = Array.from({ length: SAMPLES_COUNT + 1 }, (_, i) => {
        const point = trace.getPointAtLength((traceLength * i) / SAMPLES_COUNT);
        return {
          x: originX + (point.x - 550) * knotScale,
          y: originY + (point.y - 210) * knotScale,
        };
      });

      distance = Math.max(90, Math.min(220, (box.top + window.scrollY) * 0.75));

      while (svg!.firstChild) {
        svg!.removeChild(svg!.firstChild);
      }

      const paths = rows.map((row) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg!.appendChild(path);
        return {
          path,
          left: row.left - box.left,
          right: row.right - box.left,
          y: row.bottom - box.top + 3,
        };
      });

      function draw(t: number) {
        paths.forEach((row, index) => {
          const points: string[] = [];
          for (let i = 0; i <= SAMPLES_COUNT; i++) {
            const u = i / SAMPLES_COUNT;
            const x0 = samples[i].x;
            const y0 = samples[i].y;
            const x1 = row.left + (row.right - row.left) * u;
            const y1 = row.y + Math.sin(u * Math.PI * 2) * 0.4;
            const x = x0 + (x1 - x0) * t;
            const y = y0 + (y1 - y0) * t;
            points.push(`${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
          }
          row.path.setAttribute('d', points.join(' '));
          row.path.style.opacity = index && !t ? '0' : String(index ? Math.min(1, t * 3) : 1);
        });
      }

      drawInk = draw;

      const target = Math.min(1, Math.max(0, window.scrollY / distance));
      current = target;
      draw(current);
    }

    function animate(now: number) {
      if (!previousTime) previousTime = now;
      const delta = (now - previousTime) / 1000;
      previousTime = now;

      const target = Math.min(1, Math.max(0, window.scrollY / distance));
      const difference = target - current;

      if (Math.abs(difference) > 0.001) {
        current += difference * (1 - Math.exp(-delta * 14));
        if (drawInk) drawInk(current);
        frame = requestAnimationFrame(animate);
      } else {
        current = target;
        if (drawInk) drawInk(current);
        frame = 0;
      }
    }

    function schedule() {
      const target = Math.min(1, Math.max(0, window.scrollY / distance));
      if (Math.abs(target - current) < 0.001) return;
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    }

    let layoutFrame = 0;
    const refreshLayout = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(render);
    };
    const layoutObserver = new ResizeObserver(refreshLayout);
    layoutObserver.observe(heading);
    layoutObserver.observe(knotAnchor);
    let layoutWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === layoutWidth) return;
      layoutWidth = window.innerWidth;
      refreshLayout();
    };
    let disposed = false;
    render();
    void document.fonts.ready.then(() => {
      if (!disposed) render();
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      layoutObserver.disconnect();
      cancelAnimationFrame(layoutFrame);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="max-w-[850px] mx-auto px-6 sm:px-8 pt-14 sm:pt-18 md:pt-20 pb-6 sm:pb-8 flex flex-col justify-start"
    >
      {/* Profile Header Row: Avatar + Name on Left, Theme Toggle on Right */}
      <div className="flex items-center justify-between gap-4 mb-7 sm:mb-8 w-full">
        <div className="flex items-center gap-4 sm:gap-4.5">
          <img
            src={avatarImg}
            alt="Pranav Gawai"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-[#13261D]/15 shadow-sm flex-shrink-0"
            loading="eager"
          />
          <div>
            <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight text-[#13261D] leading-tight font-outfit">
              Pranav Gawai
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[#55655B] font-normal leading-normal mt-1">
              Software Engineer &amp; AI Builder / Pune
            </p>
          </div>
        </div>

        <ThemeToggle />
      </div>

      {/* Main Headline with Animated Knot-to-Underline Thread (Two Clean Lines) */}
      <h2
        ref={headingRef}
        className="relative font-bricolage font-semibold text-[clamp(1.625rem,2.7vw,2.125rem)] tracking-[-0.025em] text-[#13261D] leading-[1.24] mb-6 sm:mb-7 w-full"
      >
        <span className="block">
          I’m an engineer &amp; builder making AI{' '}
          <span className="whitespace-nowrap">
            products
            <span
              ref={knotRef}
              className="inline-block relative ml-2 sm:ml-2.5 w-11 h-[1em] sm:w-14 pointer-events-none select-none shrink-0 align-middle"
              aria-hidden="true"
            />
          </span>
        </span>
        <span className="block">
          <span ref={phraseRef} className="headline-unravel inline">
            fast, intuitive, and deeply habitual.
          </span>
        </span>
        <svg ref={svgRef} className="headline-thread" aria-hidden="true" />
      </h2>

      {/* Body Paragraphs | Thoughtfully Framed, Flowing, and Aesthetic */}
      <div className="text-[15px] sm:text-[16px] text-[#55655B] font-normal leading-[1.74] space-y-4 mb-7 sm:mb-8 w-full">
        <p className="m-0">
          I build AI products and developer tools, from the interface to the infrastructure. I care
          about what happens after shipping: how people discover a product, where they get stuck,
          and what brings them back.
        </p>

        <p className="m-0">
          Selected as{' '}
          <InlineEntityLink
            name="1 of 100"
            href="https://lnkd.in/p/dehiR2mf"
            logo={
              <img
                src={adobeLogoImg}
                alt="Adobe"
                className="w-full h-full object-contain rounded-xs"
              />
            }
          />{' '}
          Adobe Student Insiders from 19,000+ candidates, testing emerging creative and AI workflows
          with Adobe engineers.
        </p>

        <p className="m-0">
          Outside coursework, I built{' '}
          <InlineEntityLink
            name="PlacePro"
            href="https://www.placepro.in/"
            logo={
              <img
                src={placeproLogoTight}
                alt="PlacePro"
                className="w-full h-full object-contain dark:invert"
              />
            }
          />{' '}
          for campus placements (got ~100 users), created{' '}
          <InlineEntityLink
            name="fahh alert"
            href="https://marketplace.visualstudio.com/items?itemName=pranavdev.fahh-alert&ssr=false#overview"
            logo={
              <img
                src={falertLogo}
                alt="fahh alert"
                className="w-full h-full object-contain rounded-xs"
              />
            }
          />{' '}
          (a VS Code extension with 8,000+ developer installs), and interned at{' '}
          <InlineEntityLink
            name="IIT Mandi"
            href="https://www.iitmandi.ac.in"
            logo={
              <img
                src={iitMandiLogo}
                alt="IIT Mandi"
                className="w-full h-full object-contain rounded-xs"
              />
            }
          />
          . Happy to chat about AI products, voice, or engineering.{' '}
          <AnimatedLink
            kind="mail"
            className="hero-contact-link"
            href="mailto:pranavgawai1518@gmail.com"
          >
            Say hello.
          </AnimatedLink>
        </p>
      </div>

      {/* Companies & Roles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-4 border-b border-[#D3DCCD]/80 mb-5 sm:mb-6 w-full">
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-xs sm:text-[13px] font-semibold text-[#55655B] tracking-tight">
            Current product insider
          </span>
          <div className="flex items-center">
            <CompanyLink
              name="Adobe"
              href="https://www.adobe.com"
              logo={
                <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] flex items-center justify-center shadow-xs flex-shrink-0 overflow-hidden">
                  <img src={adobeLogoImg} alt="Adobe" className="w-full h-full object-contain" />
                </div>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
          <span className="text-xs sm:text-[13px] font-semibold text-[#55655B] tracking-tight">
            Previously at
          </span>
          <div className="flex flex-nowrap items-center gap-x-6 sm:gap-x-7 whitespace-nowrap">
            <CompanyLink
              name="IIT Mandi"
              href="https://www.iitmandi.ac.in"
              logo={
                <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-[5px] bg-white border border-[#D3DCCD] flex items-center justify-center p-[1px] shadow-xs flex-shrink-0 overflow-hidden">
                  <img
                    src={iitMandiLogo}
                    alt="IIT Mandi"
                    className="w-full h-full object-contain"
                  />
                </div>
              }
            />
            <CompanyLink
              name="CraftraStudio"
              logo={
                <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-[5px] bg-[#13261D] border border-[#13261D] flex items-center justify-center p-[1.5px] shadow-xs flex-shrink-0 overflow-hidden">
                  <img
                    src={craftaStudioLogo}
                    alt="CraftraStudio"
                    className="w-full h-full object-contain"
                  />
                </div>
              }
            />
            <CompanyLink
              name="YesBoss.ai"
              href="https://yesboss.ai"
              logo={
                <div className="w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-[5px] bg-[#0B0F19] border border-[#0B0F19] flex items-center justify-center p-[1px] shadow-xs flex-shrink-0 overflow-hidden">
                  <img
                    src={yesBossLogo}
                    alt="YesBoss.ai"
                    className="w-full h-full object-contain rounded-xs"
                  />
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Simple direct social links and availability. */}
      <div className="hero-social-bar">
        <div className="hero-social-links">
          {SOCIAL_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target={item.name !== 'Email' ? '_blank' : undefined}
              rel={item.name !== 'Email' ? 'noopener noreferrer' : undefined}
              aria-label={item.name}
            >
              {item.icon}
              <span className="hero-social-label" aria-hidden="true">
                {item.name}
              </span>
            </a>
          ))}
        </div>
        <div className="hero-wispr-link-wrap">
          <a href="/growth-plan/" className="wispr-hero-availability">
            <span className="wispr-availability-dot" aria-hidden="true" />
            <span>
              Open to build at <strong>Wispr</strong>
            </span>
            <span className="wispr-availability-detail">Explore my first month</span>
          </a>
        </div>
      </div>
    </section>
  );
};
