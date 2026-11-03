import { BrainCircuit } from 'lucide-react';
import placepro from '../../assets/placepro-logo-tight.webp';
import fahh from '../../assets/falert-logo.webp';
import type { WorkProject } from './projects';

export function ProjectVisual({
  project,
  flow = false,
  screen = false,
}: {
  project: WorkProject;
  flow?: boolean;
  screen?: boolean;
}) {
  if (flow)
    return (
      <div className={`project-art project-art-${project.id} project-flow-art`}>
        <span className="art-overline">{project.name} / workflow diagram</span>
        <div className="project-flow-nodes">
          {project.flow.map((step, i) => (
            <div key={step}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
              {i < 3 && <i aria-hidden="true">→</i>}
            </div>
          ))}
        </div>
        <span className="art-footnote">Conceptual workflow · not a product screenshot</span>
      </div>
    );
  if (screen) {
    const screens: Record<string, string> = {
      auren: 'auren.webp',
      travio: 'travio-hero.webp',
      placepro: 'placepro-hero.webp',
      mnemo: 'mnemo-hero.webp',
      'fahh-alert': 'fahh-marketplace.webp',
    };
    return (
      <div className={`project-art project-art-${project.id} project-hero-preview`}>
        <img
          className="project-real-screen"
          src={`/images/work/${screens[project.id]}`}
          decoding="async"
          width={1440}
          height={900}
          alt={`${project.name} ${project.id === 'fahh-alert' ? 'Marketplace listing' : 'landing page hero'}`}
        />
      </div>
    );
  }
  return (
    <div className={`project-art project-art-${project.id}`}>
      <span className="art-overline">{project.category}</span>
      {project.id === 'auren' && (
        <>
          <div className="art-brand">
            <img src="/images/work/auren-logo.webp" alt="" />
            <strong>Auren</strong>
          </div>
          <div className="art-pills">
            <span>Intent</span>
            <i>→</i>
            <span>Review</span>
            <i>→</i>
            <span>Execute</span>
          </div>
        </>
      )}
      {project.id === 'travio' && (
        <>
          <div className="art-brand">
            <img src="/images/work/travio-logo.svg" alt="" />
            <strong>Travio</strong>
          </div>
          <div className="art-pills">
            <span>Plan</span>
            <i>→</i>
            <span>Invite</span>
            <i>→</i>
            <span>Explore</span>
          </div>
        </>
      )}
      {project.id === 'placepro' && (
        <>
          <div className="art-brand">
            <img src={placepro} alt="" />
            <strong>PlacePro</strong>
          </div>
          <div className="art-pills">
            <span>Discover</span>
            <i>→</i>
            <span>Apply</span>
            <i>→</i>
            <span>Track</span>
          </div>
        </>
      )}
      {project.id === 'fahh-alert' && (
        <>
          <div className="art-editor">
            <i />
            <i />
            <i />
            <span>VS Code / extensions</span>
          </div>
          <div className="art-brand">
            <img src={fahh} alt="" />
            <strong>fahh alert</strong>
          </div>
          <span className="art-tagline">A little less serious.</span>
        </>
      )}
      {project.id === 'mnemo' && (
        <>
          <div className="art-brand">
            <BrainCircuit size={38} />
            <strong>Mnemo</strong>
          </div>
          <div className="art-memory">
            <span>remember</span>
            <span>retrieve</span>
            <span>correct</span>
          </div>
          <span className="art-tagline">Context with a memory.</span>
        </>
      )}
      <span className="art-footnote">Independent project</span>
    </div>
  );
}
