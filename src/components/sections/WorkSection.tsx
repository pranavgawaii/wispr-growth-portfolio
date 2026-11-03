import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { workProjects } from '../../features/projects/projects';
import { ProjectVisual } from '../../features/projects/ProjectVisual';

export function WorkSection() {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false, progress: 0 });
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const update = () => {
    setTip(null);
    const el = rail.current;
    if (el) {
      const max = el.scrollWidth - el.clientWidth;
      const next = {
        start: el.scrollLeft < 4,
        end: el.scrollLeft >= max - 4,
        progress: max > 0 ? el.scrollLeft / max : 0,
      };
      setPosition((previous) =>
        previous.start === next.start &&
        previous.end === next.end &&
        Math.abs(previous.progress - next.progress) < 0.001
          ? previous
          : next,
      );
    }
  };
  useEffect(() => {
    const observer = new ResizeObserver(update);
    if (rail.current) observer.observe(rail.current);
    update();
    return () => {
      observer.disconnect();
    };
  }, []);
  const move = (direction: number) => {
    const el = rail.current;
    const card = el?.querySelector('article');
    if (el && card)
      el.scrollBy({
        left: direction * (card.getBoundingClientRect().width + 16),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
  };
  return (
    <section id="selected-work" className="selected-work" aria-labelledby="work-heading">
      <div className="work-panel">
        <div className="work-flutes" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="work-intro">
          <span className="work-rule" aria-hidden="true" />
          <h2 id="work-heading">Side projects</h2>
          <div className="work-intro-details">
            <p>
              AI products, developer tools,
              <br className="hidden sm:block" /> and the everyday problems I build for.
            </p>
            <a className="work-explore" href="/projects/all/">
              View all projects <ArrowRight size={15} />
            </a>
          </div>
        </div>
        <div
          id="work-projects"
          className="work-rail"
          ref={rail}
          onScroll={update}
          onKeyDown={(event) => {
            if (
              event.target === event.currentTarget &&
              (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
            ) {
              event.preventDefault();
              move(event.key === 'ArrowRight' ? 1 : -1);
            }
          }}
          role="region"
          aria-label="Selected projects | scroll horizontally to explore"
          tabIndex={0}
        >
          {workProjects.map((project) => (
            <article className="work-card" key={project.id}>
              <a
                className="work-card-link"
                href={`/projects/${project.id}/`}
                aria-label={`View ${project.name} project`}
                onPointerMove={(event) => {
                  if (event.pointerType === 'mouse')
                    setTip({
                      x: Math.min(event.clientX + 15, window.innerWidth - 145),
                      y: Math.min(event.clientY + 17, window.innerHeight - 50),
                    });
                }}
                onPointerLeave={() => setTip(null)}
                onClick={() => setTip(null)}
              >
                <div className="work-card-media">
                  <ProjectVisual project={project} />
                  <span className="work-card-focus-action">
                    View project <ArrowUpRight size={14} />
                  </span>
                </div>
                <div className="work-card-copy">
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
        <div className="work-bottom">
          <div className="work-scroll-track" aria-hidden="true">
            <span style={{ transform: `translateX(${position.progress * 200}%)` }} />
          </div>
          <div className="work-controls">
            <button
              onClick={() => move(-1)}
              disabled={position.start}
              aria-label="Previous project"
            >
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => move(1)} disabled={position.end} aria-label="Next project">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      {tip && (
        <div className="work-hover-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          View project <ArrowUpRight size={14} />
        </div>
      )}
    </section>
  );
}
