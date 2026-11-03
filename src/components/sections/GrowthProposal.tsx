import { useEffect, useState } from 'react';
import '../../styles/growth-proposal.css';
export function ExperimentEntry() {
  return (
    <section
      id="first-win"
      className="experiment-entry-section"
      aria-labelledby="experiment-heading"
    >
      <h2 id="experiment-heading">My experiment</h2>
      <div className="fw-entry">
        <div>
          <span className="gp-eyebrow">A VOICE ARCADE, BUILT FOR A FIRST WIN</span>
          <h3 id="fw-entry-title">One Breath</h3>
          <p>A 30-second voice challenge. Pick a mission, speak your answer, beat your best.</p>
          <a className="gp-launch" href="/one-breath/">
            Play One Breath
          </a>
          <span className="fw-entry-note">
            Independent prototype · built for use with Wispr Flow
          </span>
        </div>
        <a className="fw-entry-preview" href="/one-breath/" aria-label="Open One Breath">
          <div className="ob-preview-top">
            <span className="ob-preview-logo" aria-hidden="true">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M3 10v5M8 6v13M13 3v19M18 7v11M23 10v5" />
              </svg>
            </span>
            <strong>one breath</strong>
            <span>THE VOICE ARCADE</span>
          </div>
          <div className="ob-preview-round">
            <span className="ob-preview-label">MISSION 01 / SAVE THE LAUNCH</span>
            <div className="ob-preview-clock">
              <strong>30</strong>
              <span>SECONDS</span>
            </div>
            <p>
              Big thought.
              <br />
              <em>One breath.</em>
            </p>
            <div className="ob-preview-bars" aria-hidden="true">
              {Array.from({ length: 19 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${8 + Math.abs(Math.sin(i * 1.8)) * 24}px`,
                    animationDelay: `${i * 65}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="ob-preview-bottom">
            <span>3 missions</span>
            <span>No sign-up</span>
            <span>Your next small win</span>
          </div>
        </a>
      </div>
    </section>
  );
}
const routeStops = [
  {
    day: '01–07',
    name: 'Find the moment',
    place: 'Campus',
    output: 'A friction map from 5 conversations',
    line: 'Watch students turn a rough interview introduction into a useful answer. Find where the first useful result breaks.',
    artifact: ['A real task', 'A hesitation', 'One hypothesis'],
  },
  {
    day: '08–14',
    name: 'Build the invitation',
    place: 'Studio',
    output: 'Two creatives from one real workflow',
    line: 'Record the actual workflow. Test a result-led invitation against a feature-led one.',
    artifact: ['Your rough words', 'A useful answer', 'Try your own task'],
  },
  {
    day: '15–21',
    name: 'Run a small pilot',
    place: 'Community',
    output: 'A tracked trial with one campus partner',
    line: 'With team approval, invite a small group through a campus creator. Track useful first tasks, not just visits.',
    artifact: ['Invitation', 'First task', 'Feedback'],
  },
  {
    day: '22–30',
    name: 'Look for a habit',
    place: 'Decision',
    output: 'A decision based on use and return',
    line: 'Ask who came back, what they used Flow for, and where others stopped. Recommend refine, expand, or stop.',
    artifact: ['Completed a task?', 'Came back?', 'What next?'],
  },
];
const road = 'M70 255 C80 125 200 115 285 195 S425 305 500 205 S640 105 720 175 S805 240 845 115';
export function GrowthPlan() {
  const [position, setPosition] = useState(0);
  const [precedent, setPrecedent] = useState(0);
  const [creative, setCreative] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  useEffect(() => {
    if (!playing) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min(now - previous, 250);
      previous = now;
      setPosition((value) => (value + elapsed / 320) % 100);
    }, 80);
    return () => window.clearInterval(timer);
  }, [playing]);
  const step = Math.min(3, Math.floor(position / 25));
  const current = routeStops[step];
  const stops = [
    [100, 112],
    [310, 120],
    [560, 100],
    [795, 95],
  ];
  function visit(index: number) {
    setPlaying(false);
    setPosition(index * 25 + 3);
  }
  return (
    <section id="growth-plan" className="gp growth-drive" aria-labelledby="gp-title">
      <header>
        <span className="gp-eyebrow">MY PROPOSED FIRST MONTH</span>
        <h2 id="gp-title">From a first try to a daily habit.</h2>
        <p>One campus. One useful task. A small experiment with a clear next move.</p>
      </header>
      <div className="drive-canvas">
        <div className="drive-map">
          <span className="drive-map-caption">
            THE FIRST-WIN ROUTE <span>Illustrated proposal</span>
          </span>
          <svg
            viewBox="0 0 900 340"
            role="group"
            aria-label="A car travels between campus research, creative studio, community pilot and a learning checkpoint."
          >
            <defs>
              <pattern id="drive-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" opacity=".08" />
              </pattern>
            </defs>
            <rect width="900" height="340" fill="url(#drive-grid)" />
            <path
              d="M0 90Q230 30 410 75T900 60M0 320Q240 280 420 330T900 310"
              fill="none"
              stroke="currentColor"
              opacity=".035"
              strokeWidth="32"
            />
            <g aria-hidden="true">
              <circle cx="708" cy="38" r="19" fill="#e6cf94" opacity=".7" />
              <path
                d="M0 303C160 278 260 328 420 303S700 284 900 311"
                fill="none"
                stroke="#c3d7d5"
                strokeWidth="25"
              />
              <path
                d="M0 303C160 278 260 328 420 303S700 284 900 311"
                fill="none"
                stroke="#edf3ef"
                strokeWidth="1.5"
                strokeDasharray="20 45"
              />
              <path
                d="M100 112v55M310 120v65M560 100v50M795 95v65"
                fill="none"
                stroke="var(--drive-road-edge)"
                strokeWidth="8"
                strokeDasharray="3 4"
                opacity=".6"
              />
              <path
                d="M14 128q55-45 120-12M435 110q80-40 165-1"
                fill="none"
                stroke="var(--drive-green)"
                strokeWidth="35"
                opacity=".3"
              />
            </g>
            {[
              [35, 65],
              [207, 64],
              [430, 70],
              [650, 60],
              [45, 285],
              [260, 278],
              [630, 264],
              [875, 248],
              [740, 275],
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <circle r="16" fill="var(--drive-green)" />
                <path
                  d="M0 -8v24m-6-19 6 6 6-6"
                  fill="none"
                  stroke="var(--mute)"
                  strokeWidth="1.3"
                  opacity=".4"
                />
              </g>
            ))}
            <path
              d={road}
              fill="none"
              stroke="var(--drive-road-edge)"
              strokeWidth="48"
              strokeLinecap="round"
            />
            <path
              d={road}
              fill="none"
              stroke="var(--drive-road)"
              strokeWidth="44"
              strokeLinecap="round"
            />
            <path d={road} fill="none" stroke="var(--sf)" strokeWidth="2" strokeDasharray="7 10" />
            <path
              d={road}
              pathLength="100"
              fill="none"
              stroke="#a18eaf"
              strokeOpacity=".4"
              strokeWidth="5"
              strokeDasharray="100"
              strokeDashoffset={100 - position}
              strokeLinecap="round"
            />
            {stops.map(([x, y], i) => (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`Visit ${routeStops[i].place}`}
                aria-pressed={step === i}
                onClick={() => visit(i)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    visit(i);
                  }
                }}
                className="drive-landmark"
                transform={`translate(${x} ${y})`}
                opacity={step === i ? 1 : 0.65}
              >
                <RouteLandmark kind={i} active={step === i} />
                <text
                  y={i === 2 ? -72 : 25}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize="15"
                  fontFamily="Outfit"
                >
                  {routeStops[i].place}
                </text>
              </g>
            ))}
            <g
              className="drive-car"
              style={{
                offsetPath: `path('${road}')`,
                offsetDistance: `${position}%`,
                opacity: Math.min(1, position / 2, (100 - position) / 2),
              }}
            >
              <ellipse cy="5" rx="24" ry="15" fill="#000" opacity=".1" />
              <rect
                x="-19"
                y="-12"
                width="38"
                height="24"
                rx="8"
                fill="#6c577d"
                stroke="#42374c"
                strokeWidth="1.5"
              />
              <rect x="-9" y="-9" width="15" height="18" rx="4" fill="#e4d7ee" />
              <path d="M-7-8v16M15-7v4m0 6v4" stroke="#fff" strokeWidth="2" />
              <rect x="-12" y="-15" width="9" height="4" rx="2" fill="#302b34" />
              <rect x="-12" y="11" width="9" height="4" rx="2" fill="#302b34" />
            </g>
          </svg>
          <div className="drive-stops" role="group" aria-label="Visit a first-month milestone">
            {routeStops.map((stop, i) => (
              <button key={stop.day} aria-pressed={step === i} onClick={() => visit(i)}>
                <small>{String(i + 1).padStart(2, '0')}</small>
                <span>{stop.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="drive-inspect">
          <div>
            <span className="gp-eyebrow">DAYS {current.day}</span>
            <h3>{current.output}</h3>
            <p>{current.line}</p>
          </div>
          {step === 1 ? (
            <div className="drive-creative">
              <div role="group" aria-label="Compare proposed campaign hooks">
                <button aria-pressed={creative === 0} onClick={() => setCreative(0)}>
                  A · Result first
                </button>
                <button aria-pressed={creative === 1} onClick={() => setCreative(1)}>
                  B · Feature first
                </button>
              </div>
              <strong>
                {creative === 0 ? 'Your next introduction. Spoken.' : 'Type with your voice.'}
              </strong>
              <span>Same task, two invitations. Measure useful first completions.</span>
            </div>
          ) : (
            <div className="drive-artifact" aria-label="Proposed deliverable">
              {current.artifact.map((label, i) => (
                <span key={label}>
                  <i>{i === 2 ? '✓' : String(i + 1).padStart(2, '0')}</i>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="drive-controls">
          <button
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? 'Pause journey' : 'Play journey'}
          >
            {playing ? 'Pause' : 'Let’s go'}
          </button>
          <input
            type="range"
            min="0"
            max="99.9"
            step=".1"
            value={position}
            aria-label="Explore the proposed first month"
            onChange={(event) => {
              setPlaying(false);
              setPosition(Number(event.target.value));
            }}
          />
          <span>
            DAY{' '}
            {Math.min(30, 1 + Math.floor(position * 0.3))
              .toString()
              .padStart(2, '0')}{' '}
            / 30
          </span>
        </div>
      </div>
      <hr className="drive-section-divider" />
      <div className="drive-research research-gallery">
        <div className="research-heading research-heading-with-credit">
          <div>
            <span className="gp-eyebrow">INSPIRED BY NIMISHA MEHTA’S WORK AT WISPR</span>
            <h3>The work that sparked my idea.</h3>
            <p>Two campaigns I studied. A lesson I’d bring to my first experiment.</p>
          </div>
          <a
            className="research-author research-author-photo"
            href="https://www.linkedin.com/in/nimisha-mehta-593758166/"
            target="_blank"
            rel="noreferrer"
            aria-label="View Nimisha Mehta’s LinkedIn profile"
          >
            <svg className="research-name-ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path id="nimisha-name-circle" d="M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0" />
              </defs>
              <text textLength="247" lengthAdjust="spacing">
                <textPath href="#nimisha-name-circle" startOffset="0">
                  NIMISHA MEHTA · NIMISHA MEHTA ·{' '}
                </textPath>
              </text>
            </svg>
            <img src="/images/nimisha-mehta.webp" alt="Nimisha Mehta" width="56" height="56" />
            <span className="research-linkedin-reveal" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6.5 8.5H3V21h3.5ZM4.75 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM21 13.8c0-3.8-4.1-4.5-6-2.1V8.5h-3.5V21H15v-6.6c0-2.5 2.5-2.7 2.5 0V21H21Z"
                />
              </svg>
            </span>
          </a>
        </div>
        <div className="research-exhibits" role="group" aria-label="Explore campaign research">
          {[0, 1].map((index) => (
            <button
              key={index}
              aria-pressed={precedent === index}
              onClick={() => setPrecedent(index)}
            >
              <span className="exhibit-number">0{index + 1}</span>
              <div className="exhibit-art" aria-hidden="true">
                <CampaignArt kind={index} />
              </div>
              <span className="exhibit-caption">
                <strong>{index === 0 ? 'Attention in context' : 'Attention into use'}</strong>
                <span>{index === 0 ? 'Bengaluru’s streets' : 'A team’s real workflow'}</span>
                <i aria-hidden="true">{precedent === index ? '●' : '○'}</i>
              </span>
            </button>
          ))}
        </div>
        <div className="research-reading" key={precedent}>
          <div className="research-observation">
            <span className="drive-source-label">WHAT CAUGHT MY ATTENTION</span>
            <h3>
              {precedent === 0
                ? 'An ad insight became 100 autos.'
                : 'A campaign led to a team workflow.'}
            </h3>
            <p>
              {precedent === 0
                ? 'Nimisha described taking a strong traffic creative onto Bengaluru’s roads: 100 branded autos, five hotspots, two days.'
                : 'In Nimisha’s account, Zepto discovered Wispr through the autos, then used Flow to brainstorm, script, and plan its birthday film.'}
            </p>
            <a
              href={
                precedent === 0
                  ? 'https://www.linkedin.com/posts/nimisha-mehta-593758166_100-wispr-flow-autos-hit-the-streets-of-bangalore-activity-7459814731432898561-NuMe'
                  : 'https://www.linkedin.com/posts/nimisha-mehta-593758166_zepto-just-turned-5-for-their-birthday-film-activity-7491455718915506177-8GS_'
              }
              target="_blank"
              rel="noreferrer"
            >
              Read Nimisha’s original post
            </a>
          </div>
          <div className="research-application">
            <span className="drive-source-label">HOW I’D APPLY THE LESSON</span>
            <h4>
              {precedent === 0
                ? 'Start where the task already lives.'
                : 'Follow the first useful result.'}
            </h4>
            <p>
              {precedent === 0
                ? 'Her approach inspired my campus idea: introduce Flow through a placement introduction students actually need to give, then test that moment with a small group.'
                : 'The Zepto story made me look beyond the invitation. My proposed pilot would follow a completed task and ask what brings someone back.'}
            </p>
            <span className="research-proposal-tag">My proposed experiment</span>
          </div>
        </div>
      </div>
      <div className="drive-pitch">
        <span className="gp-eyebrow">WHAT I’D BRING TO WISPR</span>
        <p>
          I can turn a researched insight into a working prototype, put it in front of a small
          audience, and bring back an honest decision. One Breath is my starting point.
        </p>
        <a href="/one-breath/">Explore the prototype</a>
      </div>
      <p className="drive-footnote">
        My proposal, not a Wispr campaign or measured result. Pilot scope and success criteria would
        be agreed with the team.
      </p>
    </section>
  );
}

function RouteLandmark({ kind, active }: { kind: number; active: boolean }) {
  const wall = active ? 'var(--drive-purple)' : 'var(--sf)';
  return (
    <g stroke="var(--drive-road-edge)" strokeWidth="1.4" strokeLinejoin="round">
      <ellipse cx="0" cy="3" rx="52" ry="8" fill="var(--drive-green)" stroke="none" opacity=".65" />
      {kind === 0 ? (
        <>
          <path d="M-50 0v-41h100V0" fill={wall} />
          <path d="M-21 0v-57h42V0" fill={wall} />
          <path d="m-26-57 26-19 26 19Z" fill="#c8b5d5" />
          <path d="M0-76v-20l21 6-21 6" fill="#b7c6a8" />
          <path d="M-12 0v-34m12 34v-34m12 34v-34" stroke="var(--mute)" strokeWidth="3" />
          {[-39, -27, 27, 39].map((x) => (
            <path key={x} d={`M${x} -30v8m0 7v8`} stroke="var(--mute)" strokeWidth="4" />
          ))}
          <path d="M-25 4h50m-31 5h38" />
        </>
      ) : kind === 1 ? (
        <>
          <path d="M-43 0v-53h86V0Z" fill={wall} />
          <path d="M-48-53h96v-10h-96Z" fill="#c8b5d5" />
          <rect x="-32" y="-43" width="46" height="27" rx="3" fill="#e9e2ee" />
          <path d="m-15-38 14 9-14 9Z" fill="#9a84a9" stroke="none" />
          <path d="M25 0v-31h12V0m-63-5h34" />
          <path d="M-39-73h23m-12-9v18" stroke="#a995b6" strokeWidth="2" />
          <path d="M-9-63v-17l17 17" fill="none" />
        </>
      ) : kind === 2 ? (
        <>
          <path d="M-49 0v-40h98V0" fill={wall} />
          <path d="m-55-40 10-16h90l10 16Z" fill="#c8b5d5" />
          {[-37, -18, 1, 20, 39].map((x, i) => (
            <rect
              key={x}
              x={x - 7}
              y="-40"
              width="15"
              height="12"
              rx="2"
              fill={i % 2 ? 'var(--sf)' : '#b8c8aa'}
            />
          ))}
          <rect x="-25" y="-22" width="50" height="16" rx="3" fill="#e6dfeb" />
          {[-20, 0, 20].map((x, i) => (
            <g key={x} stroke="none">
              <circle cx={x} cy={-10 + (i % 2) * 4} r="5" fill="#ae99be" />
              <path d={`M${x - 7} 4q0-15 14 0`} fill="#8b779b" />
            </g>
          ))}
        </>
      ) : (
        <>
          <path d="M-40 0v-56h80V0" fill={wall} />
          <path d="M-45-56h90v-8h-90Z" fill="#c8b5d5" />
          <rect x="-28" y="-47" width="56" height="31" rx="3" fill="#e4eadc" />
          <path d="m-17-30 9 9 24-19" stroke="#7c906b" strokeWidth="3" fill="none" />
          <path d="M-10 0v-12h20V0" />
          <path d="M50 0v-72m0 0 21 7-21 8" fill="#b5c6a4" />
        </>
      )}
    </g>
  );
}

function CampaignArt({ kind }: { kind: number }) {
  return kind === 0 ? (
    <svg
      viewBox="0 0 300 155"
      preserveAspectRatio="xMidYMid slice"
      className="campaign-driving-scene"
    >
      <rect width="300" height="155" fill="var(--campaign-sky)" />
      <rect y="102" width="300" height="53" fill="var(--campaign-ground)" />
      <g className="campaign-scenery-motion" opacity=".55">
        {[0, 240, 480].map((offset) => (
          <g key={offset} transform={`translate(${offset} 0)`}>
            <path d="M-25 101 23 51 66 85 110 38 163 91 195 60 245 101Z" fill="#ccc4d2" />
            <path d="m92 56 18-18 21 21-21-7Z" fill="#f5f1f6" />
            {[18, 205].map((x) => (
              <g key={x} transform={`translate(${x} 0)`}>
                <path d="M0 84v38" stroke="#9b9a87" strokeWidth="3" />
                <path d="m0 62-14 24h8l-12 18h36L6 86h8Z" fill="#b9c8aa" />
              </g>
            ))}
          </g>
        ))}
      </g>
      <rect y="126" width="300" height="29" fill="#93818c" opacity=".16" />
      <path d="M0 126h300" stroke="#93818c" strokeWidth="1" opacity=".3" />
      <path
        className="campaign-lane-motion"
        d="M-40 143h400"
        stroke="#93818c"
        strokeWidth="2"
        strokeDasharray="18 22"
        opacity=".65"
      />
      <g className="campaign-brand-label">
        <image href="/images/wispr-flow-mark.webp" x="84" y="9" width="15" height="15" />
        <text x="105" y="21" fontSize="12" fontFamily="Outfit" fill="currentColor">
          Wispr Flow
        </text>
        <text x="178" y="20" fontSize="8" fontFamily="Outfit" fill="currentColor" opacity=".65">
          CAMPAIGN
        </text>
      </g>
      <g className="campaign-rickshaw" stroke="#563d4c" strokeWidth="1.6" strokeLinejoin="round">
        <ellipse cx="150" cy="129" rx="66" ry="4" fill="#563d4c" opacity=".12" stroke="none" />
        <path d="M91 99V67q0-9 10-9h62q10 0 16 10l13 24 13 8v18H91Z" fill="#e8a8c2" />
        <path d="M88 64q1-12 13-12h62q14 0 20 15H88Z" fill="#bc708f" />
        <path d="M101 69h43v28h-43Z" fill="#f8e9ef" />
        <path d="M153 69h12l13 25h-25Z" fill="#f8e9ef" />
        <path d="M151 67v46M97 103h45M179 99l12 2" fill="none" />
        <path d="M95 114h106v7H95Z" fill="#bc708f" />
        <path d="M181 103h12v8h-12Z" fill="#fff0d0" />
        <path d="M179 86h12m0-5v9" fill="none" strokeLinecap="round" />
        <rect x="106" y="79" width="29" height="12" rx="3" fill="#fff6fa" stroke="none" />
        <image href="/images/wispr-flow-mark.webp" x="109" y="81" width="8" height="8" />
        <text x="119" y="88" fill="#563d4c" stroke="none" fontFamily="Outfit" fontSize="6">
          Flow
        </text>
        {[112, 183].map((x) => (
          <g key={x}>
            <circle cx={x} cy="119" r="10" fill="#493e45" />
            <circle cx={x} cy="119" r="4.5" fill="#f4d5e2" stroke="none" />
            <circle cx={x} cy="119" r="1.4" fill="#bc708f" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  ) : (
    <svg viewBox="0 0 240 155">
      <text x="29" y="23" fontSize="10" fill="currentColor">
        CAMPAIGN TO WORKFLOW
      </text>
      <rect x="30" y="35" width="135" height="85" rx="8" fill="#d7c4e6" />
      <path className="campaign-play-motion" d="m83 55 32 22-32 22Z" fill="#fff" />
      <g
        className="campaign-script-motion"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      >
        <path d="M52 62h78M52 77h60M52 92h68" />
      </g>
      <g className="campaign-result-motion">
        <rect x="138" y="75" width="74" height="58" rx="8" fill="#e0e7d8" stroke="#b9c5ad" />
        <path
          className="campaign-check-motion"
          pathLength="1"
          d="m157 104 10 10 25-25"
          fill="none"
          stroke="#6c7b5f"
          strokeWidth="5"
        />
      </g>
    </svg>
  );
}
