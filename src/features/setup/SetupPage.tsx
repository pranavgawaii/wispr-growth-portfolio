import { useEffect, useRef, useState } from 'react';
import {
  Laptop,
  Monitor,
  Mic,
  HardDrive,
  Armchair,
  LampDesk,
  Headphones,
  ChevronRight,
  X,
  Minus,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Footer } from '../../components/layout/Footer';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import avatar from '../../assets/avatar.webp';
import './setup.css';

const essentials = [
  {
    title: 'A capable laptop',
    icon: <Laptop aria-hidden="true" />,
    text: 'A capable laptop with enough memory and storage for development, testing and video editing.',
    tag: 'The foundation',
    outcome:
      'Working prototypes, tested interfaces and product demos, with enough headroom to keep the workflow moving.',
  },
  {
    title: 'An external monitor',
    icon: <Monitor aria-hidden="true" />,
    text: 'An external monitor with readable text and enough space to keep the product beside research, feedback or an edit timeline.',
    tag: 'Room to focus',
    outcome:
      'Better-reviewed interfaces and clearer edits, with user feedback visible beside the product.',
  },
  {
    title: 'An ergonomic chair',
    icon: <Armchair aria-hidden="true" />,
    text: 'An ergonomic chair with adjustable support, paired with a comfortable desk arrangement for focused work.',
    tag: 'Everyday comfort',
    outcome:
      'A comfortable place to work consistently, from the first prototype to the final edit.',
  },
  {
    title: 'A monitor light bar',
    icon: <LampDesk aria-hidden="true" />,
    text: 'A monitor light bar and adjustable desk lighting for a well-lit workspace during evening sessions.',
    tag: 'A considered workspace',
    outcome: 'A well-lit desk for reading, building and reviewing work in the evening.',
  },
  {
    title: 'Premium AI tools',
    icon: (
      <>
        <img src="/images/tools/claude-ai-icon.svg" alt="Claude" />
        <img src="/images/tools/codex.svg" alt="Codex" />
      </>
    ),
    text: 'Access to premium AI coding and creative tools, including Claude, Codex and other useful software as the work evolves.',
    tag: 'Room to explore',
    outcome:
      'More iterations on ideas, code and launch stories, with room to compare approaches and improve the result.',
  },
  {
    title: 'Wispr Flow access',
    icon: <img src="/images/wispr-flow-mark.webp" alt="Wispr Flow" />,
    text: 'Wispr Flow access for dictating prompts, drafting messages and thinking out loud in the apps I already use.',
    tag: 'Keep the thought moving',
    outcome:
      'Natural voice prompts, clearer drafts and a way to bring voice into everyday building workflows.',
  },
  {
    title: 'Microphone & headphones',
    icon: (
      <>
        <Mic aria-hidden="true" />
        <Headphones aria-hidden="true" />
      </>
    ),
    text: 'A microphone and comfortable headphones for voice workflows, calls and clear product recordings.',
    tag: 'Clear audio',
    outcome:
      'Clear walkthroughs, user conversations and recordings that make the product easy to understand.',
  },
  {
    title: 'Backup storage',
    icon: <HardDrive aria-hidden="true" />,
    text: 'Reliable external storage for project files, screen recordings and edit assets, with a regular backup routine.',
    tag: 'Protect the work',
    outcome:
      'A reusable library of recordings and project assets, with backups of the work behind each release.',
  },
];

export function SetupPage() {
  const [activeTool, setActiveTool] = useState(0);
  const [inside, setInside] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [windowMode, setWindowMode] = useState<'open' | 'minimized' | 'closed'>('open');
  const [maximized, setMaximized] = useState(false);
  const dockRef = useRef<HTMLElement>(null);
  const openTool = (index: number) => {
    setActiveTool(index);
    setWindowMode('open');
  };
  useEffect(() => {
    if (inside && windowMode !== 'open')
      dockRef.current
        ?.querySelector<HTMLButtonElement>('button[data-active="true"]')
        ?.focus({ preventScroll: true });
  }, [inside, windowMode]);
  const enterRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const hasOpened = useRef(false);
  useEffect(() => {
    if (inside) {
      hasOpened.current = true;
      backRef.current?.focus({ preventScroll: true });
    } else if (hasOpened.current) enterRef.current?.focus({ preventScroll: true });
  }, [inside]);
  return (
    <div className="setup-page" data-sound="off">
      <header className="setup-header">
        <nav className="setup-nav" aria-label="Setup page navigation">
          <a className="setup-profile" href="/">
            <img src={avatar} alt="" width="38" height="38" />
            <span>Pranav Gawai</span>
          </a>
          <div className="setup-nav-links">
            <a href="/">Back to portfolio</a>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main id="main" className="setup-main">
        <header className="setup-intro">
          <span className="setup-kicker">MY IDEAL DEVELOPER SETUP</span>
          <h1>The $3,000 question.</h1>
          <p>A considered setup for building and creating.</p>
          <span className="setup-subtitle">
            Hardware, comfort, lighting, software and audio. The essentials I’d put to work.
          </span>
        </header>
        <section className="setup-ai-center" aria-label="The tools behind my work">
          <div className="setup-ai-heading">
            <span className="setup-kicker">THE TOOLS BEHIND THE WORK</span>
            <h2>
              More room to think.
              <br />
              More capacity to build.
            </h2>
            <p>
              A capable laptop and external monitor. An ergonomic chair and monitor light bar.
              Premium AI tools, Wispr Flow, clear audio and reliable backup storage.
            </p>
          </div>
          <div
            className={`setup-meadow ${inside ? 'is-inside' : ''}`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setInside(false);
            }}
          >
            <img
              className="setup-meadow-scene"
              src="/images/setup/meadow-workspace.webp"
              alt="An imagined workspace: a curly-haired builder at a vintage computer in a sunlit meadow"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
            {!inside && (
              <>
                <span className="setup-meadow-label">AN IMAGINED WORKSPACE</span>
                <div className="setup-welcome-screen">
                  <span className="setup-hello">Hello.</span>
                  <span className="setup-welcome-copy">Come see what I’d build.</span>
                  <button
                    className="setup-monitor-enter"
                    ref={enterRef}
                    onClick={() => {
                      setInside(true);
                      setWindowMode('open');
                    }}
                    aria-expanded={inside}
                    aria-controls="setup-desktop"
                  >
                    Open my workspace <ChevronRight size={11} aria-hidden="true" />
                  </button>
                </div>
                <span className="setup-meadow-bottom">A little room to think. A lot to make.</span>
              </>
            )}
            {inside && (
              <section id="setup-desktop" className="setup-desktop" aria-label="Inside my setup">
                <header className="setup-desktop-bar">
                  <button ref={backRef} onClick={() => setInside(false)}>
                    Back to the meadow
                  </button>
                  <span>Pranav’s workspace</span>
                  <small>My setup</small>
                </header>
                <div className="setup-desktop-body setup-mac-desktop">
                  <div className="setup-desktop-heading">
                    <span className="setup-kicker">HARDWARE, SOFTWARE & SPACE TO FOCUS</span>
                    <h3>My ideal setup.</h3>
                  </div>
                  {windowMode === 'open' ? (
                    <section
                      className={`setup-mac-window ${maximized ? 'is-maximized' : ''}`}
                      aria-label="Setup notes window"
                    >
                      <header className="setup-mac-titlebar">
                        <div className="setup-window-controls">
                          <button
                            className="setup-window-close"
                            aria-label="Close setup notes"
                            title="Close"
                            onClick={() => {
                              setWindowMode('closed');
                              setMaximized(false);
                            }}
                          >
                            <X size={9} aria-hidden="true" />
                          </button>
                          <button
                            className="setup-window-minimize"
                            aria-label="Minimize setup notes"
                            title="Minimize"
                            onClick={() => setWindowMode('minimized')}
                          >
                            <Minus size={9} aria-hidden="true" />
                          </button>
                          <button
                            className="setup-window-maximize"
                            aria-label={maximized ? 'Restore window size' : 'Maximize setup notes'}
                            title={maximized ? 'Restore' : 'Maximize'}
                            onClick={() => setMaximized(!maximized)}
                          >
                            {maximized ? (
                              <Minimize2 size={8} aria-hidden="true" />
                            ) : (
                              <Maximize2 size={8} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        <span>My setup notes</span>
                        <small>
                          {activeTool + 1} of {essentials.length}
                        </small>
                      </header>
                      <div className="setup-mac-window-content">
                        <div className="setup-mac-note-icon">{essentials[activeTool].icon}</div>
                        <div className="setup-note-toolbar">
                          <button onClick={() => setShowOutcome(false)} aria-pressed={!showOutcome}>
                            Why I want it
                          </button>
                          <button onClick={() => setShowOutcome(true)} aria-pressed={showOutcome}>
                            What I’ll make
                          </button>
                        </div>
                        <div
                          className="setup-note-content"
                          key={`${activeTool}-${showOutcome}`}
                          aria-live="polite"
                        >
                          <span className="setup-kicker">{essentials[activeTool].tag}</span>
                          <h4>{essentials[activeTool].title}</h4>
                          <p>
                            {showOutcome
                              ? essentials[activeTool].outcome
                              : essentials[activeTool].text}
                          </p>
                        </div>
                      </div>
                      <footer className="setup-mac-status">
                        <span>{showOutcome ? 'The outcome' : 'The essential'}</span>
                        <button onClick={() => openTool((activeTool + 1) % essentials.length)}>
                          Next item <ChevronRight size={12} aria-hidden="true" />
                        </button>
                      </footer>
                    </section>
                  ) : (
                    <div className="setup-mac-empty" role="status">
                      <span className="setup-kicker">
                        {windowMode === 'minimized' ? 'WINDOW MINIMIZED' : 'WINDOW CLOSED'}
                      </span>
                      <h4>Everything’s in the dock.</h4>
                      <p>Choose an icon below to open its setup note.</p>
                      <button onClick={() => setWindowMode('open')}>Reopen my notes</button>
                    </div>
                  )}
                </div>
                <nav className="setup-mac-dock" ref={dockRef} aria-label="Setup dock">
                  {essentials.map((item, i) => (
                    <button
                      key={item.title}
                      data-active={activeTool === i}
                      aria-pressed={activeTool === i && windowMode === 'open'}
                      aria-label={`Open ${item.title}`}
                      onClick={() => openTool(i)}
                    >
                      <span className="setup-dock-tooltip">{item.title}</span>
                      <span className="setup-dock-icon">{item.icon}</span>
                      <span
                        className={`setup-dock-indicator ${activeTool === i && windowMode !== 'closed' ? 'is-running' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </nav>
                <span className="setup-dock-caption">Choose a dock icon to open a note.</span>
              </section>
            )}
          </div>
          <p className="setup-ai-caption">
            Open the computer to explore my wishlist, one essential at a time.
          </p>
        </section>
        <section className="setup-plan" aria-labelledby="setup-plan-title">
          <header>
            <span className="setup-kicker">IF I GET IT</span>
            <h2 id="setup-plan-title">Here’s how I’d put it to work.</h2>
            <p>
              A setup is useful when it helps something reach a real person. This is the loop I’d
              use it for.
            </p>
          </header>
          <ol className="setup-plan-steps">
            <li>
              <span className="setup-plan-number">01</span>
              <h3>Build a useful first try.</h3>
              <p>Choose one everyday task and make a small voice-first prototype people can use.</p>
              <span>Prototype</span>
            </li>
            <li>
              <span className="setup-plan-number">02</span>
              <h3>Watch what happens.</h3>
              <p>
                Put it in front of people, observe where they get stuck and test a focused
                improvement.
              </p>
              <span>Learn</span>
            </li>
            <li>
              <span className="setup-plan-number">03</span>
              <h3>Make the learning travel.</h3>
              <p>
                Record a clear demo, share what worked and what didn’t, and use that evidence for
                the next build.
              </p>
              <span>Share & iterate</span>
            </li>
          </ol>
        </section>
        <p className="setup-personal-note">
          One oddly specific extra: a quiet corner where talking to my laptop counts as work.
        </p>
        <section className="setup-links" aria-label="Related work">
          <a href="/growth-plan/">
            <span>THE PROPOSAL</span>My first month at Wispr
          </a>
          <a href="/one-breath/">
            <span>THE EXPERIMENT</span>Play One Breath
          </a>
          <a href="https://youtu.be/KFPjwPiN1ZI" target="_blank" rel="noreferrer">
            <span>THE WALKTHROUGH</span>Watch the explanation
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
