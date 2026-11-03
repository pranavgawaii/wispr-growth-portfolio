import { useEffect, useRef, useState } from 'react';
import {
  House,
  ArrowRight,
  ArrowUpRight,
  Expand,
  X,
  Folder,
  UserRound,
  Layers,
  CircleDot,
  Database,
  CheckCheck,
  ScanSearch,
  GitBranch,
  BookOpen,
  Lightbulb,
  Workflow,
  Code2,
  Scale,
  Flag,
} from 'lucide-react';
import { workProjects, type WorkProject } from './projects';
import { ProjectVisual } from './ProjectVisual';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import avatar from '../../assets/avatar.webp';
import { AnimatedLink } from '../../components/ui/AnimatedLink';
import { caseDetails } from './caseDetails';
import { PlaneTakeoff, BrainCircuit, GraduationCap, Terminal, Command } from 'lucide-react';
import { WorkflowExample } from './WorkflowExample';
import { HookSidebar } from '../../components/ui/HookSidebar';

function ProjectGallery({ project }: { project: WorkProject }) {
  const modal = useRef<HTMLDialogElement>(null);
  return (
    <figure className="case-gallery" aria-label={`${project.name} preview`}>
      <div className="case-gallery-stage">
        <button
          className="case-gallery-expand"
          onClick={() => modal.current?.showModal()}
          aria-label="View preview full size"
        >
          <ProjectVisual project={project} screen />
          <span>
            <Expand size={15} />
          </span>
        </button>
      </div>
      <figcaption className="case-gallery-caption">
        {project.id === 'fahh-alert' ? 'Marketplace listing' : 'Landing page'}{' '}
        <span>Click to expand ↗</span>
      </figcaption>
      <dialog
        ref={modal}
        className="case-lightbox"
        aria-label={`${project.name} expanded preview`}
        onClick={(event) => {
          if (event.target === event.currentTarget) modal.current?.close();
        }}
      >
        <div>
          <button
            className="case-lightbox-close"
            onClick={() => modal.current?.close()}
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
          <ProjectVisual project={project} screen />
        </div>
      </dialog>
    </figure>
  );
}
function ProjectLinks({ project }: { project: WorkProject }) {
  return (
    <div className="case-links">
      {project.links.map((link) => (
        <AnimatedLink
          key={link.href}
          icon={
            link.label === 'Source code'
              ? undefined
              : projectLinkIcons[project.id as keyof typeof projectLinkIcons]
          }
          kind={link.label === 'Source code' ? 'source' : 'website'}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </AnimatedLink>
      ))}
    </div>
  );
}
const projectLinkIcons = {
  auren: Command,
  travio: PlaneTakeoff,
  placepro: GraduationCap,
  mnemo: BrainCircuit,
  'fahh-alert': Terminal,
};
function WorkflowDiagram({ project }: { project: WorkProject }) {
  const icons = [ScanSearch, Database, GitBranch, CheckCheck];
  return (
    <figure className="case-diagram" aria-label={`${project.name} workflow diagram`}>
      <div className="diagram-heading">
        <span>
          <Folder size={15} />
          {project.name}
        </span>
        <span>WORKFLOW OVERVIEW</span>
      </div>
      <div className="diagram-track">
        {project.flow.map((step, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div className="diagram-step" key={step}>
              <span className="diagram-number">0{i + 1}</span>
              <div className="diagram-node">
                <Icon size={21} strokeWidth={1.5} />
                <strong>{step}</strong>
              </div>
              {i < project.flow.length - 1 && (
                <span className="diagram-connector" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <figcaption>
        <span className="diagram-status" /> Product workflow<span>Conceptual diagram</span>
      </figcaption>
    </figure>
  );
}
const dockIcons = [BookOpen, Lightbulb, Workflow, Code2, Scale, Flag];
const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'contribution', label: 'Implementation' },
  { id: 'design', label: 'Decisions' },
  { id: 'impact', label: 'Results' },
];
function CaseNavigation({ slug }: { slug: string }) {
  const [active, setActive] = useState('overview');
  useEffect(() => {
    const update = () => {
      let current = 'overview';
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= Math.max(180, window.innerHeight * 0.55))
          current = id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8)
        current = 'impact';
      setActive(current);
    };
    const openSection = (path: string, smooth: boolean) => {
      const id = path.split('/')[3] || 'overview';
      if (!sections.some((section) => section.id === id)) return;
      setActive(id);
      document.getElementById(id)?.scrollIntoView({
        behavior:
          smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'smooth'
            : 'instant',
      });
    };
    const navigate = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        '.case-sidebar a, .case-mobile-dock a',
      );
      if (!anchor) return;
      const url = new URL(anchor.href);
      if (
        url.origin !== window.location.origin ||
        !sections.some((section) => url.pathname.endsWith(`/${section.id}/`))
      )
        return;
      event.preventDefault();
      window.history.pushState(null, '', url.pathname);
      openSection(url.pathname, true);
    };
    const restore = () => openSection(window.location.pathname, false);
    document.addEventListener('click', navigate);
    window.addEventListener('popstate', restore);
    const observer = new IntersectionObserver(update, {
      rootMargin: '-10% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener('click', navigate);
      window.removeEventListener('popstate', restore);
      window.removeEventListener('scroll', update);
    };
  }, []);
  return (
    <>
      <nav className="case-mobile-dock" aria-label="Project sections">
        {sections.map((section, index) => {
          const Icon = dockIcons[index];
          return (
            <a
              key={section.id}
              href={`/projects/${slug}/${section.id}/`}
              aria-current={active === section.id ? 'location' : undefined}
              onClick={() => setActive(section.id)}
            >
              <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>{section.label === 'Implementation' ? 'Build' : section.label}</span>
            </a>
          );
        })}
      </nav>
      <aside className="case-sidebar">
        <HookSidebar
          label="In this project"
          color="var(--ink)"
          onChange={(index) => setActive(sections[index].id)}
          value={sections.findIndex((section) => section.id === active)}
          items={sections.map((section) => ({
            label: section.label,
            href: `/projects/${slug}/${section.id}/`,
          }))}
        />
      </aside>
    </>
  );
}
export function ProjectPage({ slug }: { slug: string }) {
  const project = workProjects.find((item) => item.id === slug);
  useEffect(() => {
    const previous = document.title;
    document.title = project ? `${project.name} | Pranav Gawai` : 'Side projects | Pranav Gawai';
    const section = window.location.pathname.split('/')[3];
    const frame = requestAnimationFrame(() => {
      if (section && sections.some((item) => item.id === section))
        document.getElementById(section)?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    if (window.location.search.includes('work='))
      window.history.replaceState(null, '', `/projects/${slug}/`);
    return () => {
      cancelAnimationFrame(frame);
      document.title = previous;
    };
  }, [project]);
  const index = project ? workProjects.indexOf(project) : 0;
  const next = workProjects[(index + 1) % workProjects.length];
  return (
    <div className="case-page">
      <header className="case-header">
        <a href="/">
          <img src={avatar} alt="" />
          Pranav Gawai
        </a>
        {!project && <ThemeToggle />}
      </header>
      {project ? (
        <main className="case-main">
          <nav className="case-breadcrumb" aria-label="Breadcrumb">
            <a href="/">
              <House size={16} strokeWidth={1.75} aria-hidden="true" /> Home
            </a>
            <span aria-hidden="true">/</span>
            <a href="/projects/all/">
              <Folder size={16} strokeWidth={1.75} aria-hidden="true" /> Side projects
            </a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.name}</span>
            <div className="breadcrumb-theme">
              <ThemeToggle />
            </div>
          </nav>
          <section id="overview" className="case-overview">
            <div className="case-opening">
              <span className="case-section-index">01 / PROJECT OVERVIEW · {project.name}</span>
              <h1>{project.title}</h1>
              <p>{project.summary}</p>
            </div>
            <dl className="case-meta">
              <div>
                <dt>
                  <UserRound size={17} /> Role
                </dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>
                  <Layers size={17} /> Stack
                </dt>
                <dd>{project.stack}</dd>
              </div>
              <div>
                <dt>
                  <CircleDot size={17} /> Status
                </dt>
                <dd>{caseDetails[project.id].status}</dd>
              </div>
            </dl>
            <ProjectLinks project={project} />
            <ProjectGallery project={project} />
          </section>
          <div className="case-body">
            <CaseNavigation slug={project.id} />
            <div className="case-story">
              <section className="case-section" id="problem">
                <span className="case-section-index">02 / THE PROBLEM</span>
                <h2>Why this project exists</h2>
                <p>{project.problem}</p>
              </section>
              <section className="case-section" id="solution">
                <span className="case-section-index">03 / THE SOLUTION</span>
                <h2>What it does</h2>
                <p>{caseDetails[project.id].solution}</p>
                {caseDetails[project.id].architecture ? (
                  <WorkflowDiagram project={project} />
                ) : (
                  <ArchitectureDiagram project={project} />
                )}
                <WorkflowExample slug={project.id} />
              </section>
              <section className="case-section" id="contribution">
                <span className="case-section-index">04 / TECHNICAL IMPLEMENTATION</span>
                <h2>How it’s built</h2>
                <div className="case-implementation">
                  {caseDetails[project.id].implementation.map((item) => (
                    <article key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>
                {caseDetails[project.id].architecture && <ArchitectureDiagram project={project} />}
              </section>
              <section className="case-section" id="design">
                <span className="case-section-index">05 / ENGINEERING DECISIONS</span>
                <h2>The trade-offs that mattered</h2>
                <div className="case-design-list">
                  {caseDetails[project.id].decisions.map((item, i) => (
                    <article key={item.title}>
                      <span>0{i + 1}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <section className="case-section" id="impact">
                <span className="case-section-index">06 / RESULTS &amp; PROJECT LINKS</span>
                <h2>What shipped</h2>
                <p>{caseDetails[project.id].result}</p>
                <ProjectLinks project={project} />
              </section>
            </div>
          </div>
          <nav className="case-project-navigation" aria-label="Explore more projects">
            <AnimatedLink kind="collection" href="/projects/all/">
              All side projects
            </AnimatedLink>
            <AnimatedLink kind="next" href={`/projects/${next.id}/`}>
              Next: {next.name}
            </AnimatedLink>
          </nav>
        </main>
      ) : (
        <main className="case-main case-all">
          <a className="case-breadcrumb" href="/projects/">
            <House size={16} strokeWidth={1.75} aria-hidden="true" /> Home
          </a>
          <h1>Side projects.</h1>
          <p>Products, experiments, and engineering contributions.</p>
          <div className="all-work-grid">
            {workProjects.map((item) => (
              <a key={item.id} href={`/projects/${item.id}/`}>
                <ProjectVisual project={item} />
                <h2>
                  {item.name}
                  <ArrowUpRight size={18} />
                </h2>
                <p>{item.summary}</p>
              </a>
            ))}
          </div>
        </main>
      )}
      <footer className="case-footer">
        <span>© {new Date().getFullYear()} Pranav Gawai</span>
        <AnimatedLink kind="mail" href="mailto:pranavgawai1518@gmail.com">
          Get in touch
        </AnimatedLink>
      </footer>
    </div>
  );
}
