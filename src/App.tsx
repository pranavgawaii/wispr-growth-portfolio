import React, { lazy, Suspense } from 'react';
import { socialPages, projectSectionPages } from '../shared/social-pages.mjs';
import { NotFound } from './components/layout/NotFound';
import { useSectionRoutes } from './hooks/useSectionRoutes';
import { useClickSound } from './hooks/useClickSound';
const OneBreath = lazy(() =>
  import('./features/onebreath/OneBreath').then((module) => ({ default: module.OneBreath })),
);
import { ExperimentEntry, GrowthPlan } from './components/sections/GrowthProposal';
const ProjectPage = lazy(() =>
  import('./features/projects/ProjectPage').then((module) => ({ default: module.ProjectPage })),
);
import { ScrollProgress } from './components/layout/ScrollProgress';
import { SkipLink } from './components/layout/SkipLink';
import { WorkSection } from './components/sections/WorkSection';
import { HeroSection } from './components/sections/HeroSection';
import { VoiceLabSection } from './components/sections/VoiceLabSection';
import { GitHubHeatmap } from './components/ui/GitHubHeatmap';
import TechStackSection from './components/sections/TechStackSection';
import { WisprClosing } from './components/sections/WisprClosing';
import { SetupPage } from './features/setup/SetupPage';
import { Footer } from './components/layout/Footer';

const App: React.FC = () => {
  useClickSound();
  useSectionRoutes();

  const path = window.location.pathname.replace(/\/+$/, '') + '/';
  const known =
    [...socialPages, ...projectSectionPages].some((page) => page.path === path) ||
    ['/main/', '/hero/'].includes(path);
  if (path === '/setup/') return <SetupPage />;
  if (!known) return <NotFound />;

  if (window.location.pathname.startsWith('/one-breath'))
    return (
      <Suspense fallback={<div className="studio-loading">Opening One Breath…</div>}>
        <OneBreath />
      </Suspense>
    );
  const projectPath = window.location.pathname.match(/^\/projects\/([^/]+)(?:\/[^/]+)?\/?$/);
  const workSlug = projectPath?.[1] || new URLSearchParams(window.location.search).get('work');
  if (workSlug)
    return (
      <Suspense fallback={<div className="studio-loading">Opening the project…</div>}>
        <ProjectPage slug={workSlug} />
      </Suspense>
    );

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#141210] text-[#1C1917] dark:text-[#FAF7F2] transition-colors duration-200">
      <ScrollProgress />
      <SkipLink />
      <main id="main" tabIndex={-1} className="portfolio-with-ribbon">
        <HeroSection />
        <WorkSection />
        <ExperimentEntry />
        <VoiceLabSection />
        <GitHubHeatmap />
        <TechStackSection />
        <GrowthPlan />
        <WisprClosing />
      </main>
      <Footer />
    </div>
  );
};

export default App;
