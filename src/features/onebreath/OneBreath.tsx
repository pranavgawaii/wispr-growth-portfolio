import { useEffect, useRef, useState } from 'react';
import {
  AudioLines,
  Settings,
  Moon,
  Sun,
  Check,
  CheckCheck,
  Copy,
  Flag,
  Keyboard,
  Mic,
  RotateCcw,
  Trophy,
  X,
} from 'lucide-react';
import { missions, durations, scoreRound, words, type Method, type RoundResult } from './game.mjs';
import { Footer } from '../../components/layout/Footer';
import './one-breath.css';

type Phase = 'ready' | 'running' | 'settling' | 'result';
type BoardEntry = {
  id: string;
  alias: string;
  score: number;
  words: number;
  mission: string;
  seconds: number;
  method: Method;
};
type HistoryItem = {
  mission: string;
  seconds: number;
  method: Method;
  score: number;
  date: string;
};
type Session = { id: string; token: string };
function preference(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
const HISTORY_KEY = 'one-breath-history-v1';
const methodNames = { flow: 'Wispr Flow', mic: 'Browser mic', type: 'Keyboard' };
const readHistory = (): HistoryItem[] => {
  try {
    const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(data)
      ? data
          .filter((item) => typeof item?.score === 'number' && typeof item?.date === 'string')
          .slice(-100)
      : [];
  } catch {
    return [];
  }
};

function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={`ob-mark ${small ? 'ob-mark-small' : ''}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
export function OneBreath() {
  useEffect(() => {
    const icons = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="shortcut icon"]'),
    );
    const previous = icons.map((icon) => ({ icon, href: icon.href, type: icon.type }));
    icons.forEach((icon) => {
      icon.href = '/one-breath-icon.svg';
      icon.type = 'image/svg+xml';
    });
    return () =>
      previous.forEach(({ icon, href, type }) => {
        icon.href = href;
        icon.type = type;
      });
  }, []);
  const [defaultTime, setDefaultTime] = useState(() => preference('one-breath-default-time', '30'));
  const [defaultMethod, setDefaultMethod] = useState(() =>
    preference('one-breath-default-method', 'flow'),
  );
  const [settingsNotice, setSettingsNotice] = useState('');
  const [replay, setReplay] = useState(0);
  const [showInvite, setShowInvite] = useState(false);
  const [quietMotion, setQuietMotion] = useState(() => {
    try {
      return localStorage.getItem('one-breath-quiet-motion') === 'true';
    } catch {
      return false;
    }
  });
  const [showStartGuide, setShowStartGuide] = useState(
    () => preference('one-breath-guide-dismissed', 'false') !== 'true',
  );
  const [demo, setDemo] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(true);
  const demos = [
    {
      label: 'Team update',
      raw: 'so um mobile login is stuck but desktop works and the fix is coming tomorrow',
      clean: 'Mobile login is stuck. Desktop works. Fix expected tomorrow.',
      task: 'Save the launch',
      time: '30 seconds',
    },
    {
      label: 'Interview',
      raw: 'I’m a developer and I built a campus placement tool and learned to start with user feedback',
      clean:
        'I’m a developer. I built a campus placement tool and learned to start with user feedback.',
      task: 'Make your introduction',
      time: '60 seconds',
    },
    {
      label: 'Read-back',
      raw: 'The mobile login is stuck. Desktop works. The fix is expected tomorrow.',
      clean: 'The mobile login is stuck. Desktop works. The fix is expected tomorrow.',
      task: 'Keep the meaning',
      time: '30 seconds',
    },
  ];
  const page = location.pathname.includes('/settings')
    ? 'settings'
    : location.pathname.includes('/leaderboard')
      ? 'leaderboard'
      : location.pathname.includes('/how-to-play')
        ? 'how-to-play'
        : location.pathname.includes('/challenge')
          ? 'challenge'
          : 'home';
  useEffect(() => {
    if (page !== 'home' || quietMotion || !previewPlaying) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!reduced.matches)
        timer = setInterval(() => {
          if (!document.hidden) setRevealed((value) => !value);
        }, 6000);
    };
    sync();
    reduced.addEventListener('change', sync);
    return () => {
      clearInterval(timer);
      reduced.removeEventListener('change', sync);
    };
  }, [page, quietMotion, previewPlaying, demo]);
  const invite = new URLSearchParams(location.search);
  const inviter = (invite.get('from') || '').trim().slice(0, 24);
  const acceptanceKey = `one-breath-accepted:${location.search}`;
  const [acceptedBy, setAcceptedBy] = useState(() => preference(acceptanceKey, ''));
  function acceptInvitation(name: string) {
    setAcceptedBy(name);
    try {
      localStorage.setItem(acceptanceKey, name);
    } catch {}
  }
  useEffect(() => {
    if (!showInvite) return;
    setInviteCopied(false);
    const previous = document.activeElement as HTMLElement | null;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowInvite(false);
    };
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('keydown', close);
      previous?.focus();
    };
  }, [showInvite]);
  const [player, setPlayer] = useState(() => {
    try {
      return (
        localStorage.getItem('one-breath-player') ||
        sessionStorage.getItem('one-breath-player') ||
        ''
      );
    } catch {
      return '';
    }
  });
  const [photoNotice, setPhotoNotice] = useState('');
  const [avatar, setAvatar] = useState(() => preference('one-breath-avatar', '✦'));
  const [photo, setPhoto] = useState(() => preference('one-breath-photo', ''));
  function saveAvatar(value: string) {
    setPhotoNotice('');
    setAvatar(value);
    setPhoto('');
    try {
      localStorage.setItem('one-breath-avatar', value);
      localStorage.removeItem('one-breath-photo');
    } catch {}
  }
  function uploadPhoto(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 400000) {
      setPhotoNotice('Choose a JPG, PNG or WebP smaller than 400 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result);
      try {
        localStorage.setItem('one-breath-photo', data);
        setPhoto(data);
        setPhotoNotice('Profile picture saved only in this browser.');
      } catch {
        setPhotoNotice('Browser storage is full. Try a smaller picture or choose an icon.');
      }
    };
    reader.onerror = () => setPhotoNotice('Could not read this picture. Try another file.');
    reader.readAsDataURL(file);
  }
  const [nameDraft, setNameDraft] = useState(player);
  const [inviteCopied, setInviteCopied] = useState(false);
  async function copyInvitation() {
    const url = new URL('/one-breath/challenge/', location.origin);
    url.searchParams.set('mission', missionId);
    url.searchParams.set('seconds', String(seconds));
    url.searchParams.set('method', method);
    url.searchParams.set('from', player);
    if (result) url.searchParams.set('beat', String(result.score));
    try {
      await navigator.clipboard.writeText(url.href);
      setInviteCopied(true);
    } catch {
      setNotice('Could not copy the invitation. Please try again.');
    }
  }

  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('one-breath-theme') === 'dark';
    } catch {
      return false;
    }
  });
  function toggleTheme() {
    setDark((value) => {
      const next = !value;
      try {
        localStorage.setItem('one-breath-theme', next ? 'dark' : 'light');
      } catch {}
      return next;
    });
  }

  const [missionId, setMissionId] = useState(() =>
    missions.some((m) => m.id === invite.get('mission')) ? invite.get('mission')! : 'signal',
  );
  const mission = missions.find((item) => item.id === missionId)!;
  const [seconds, setSeconds] = useState(() =>
    [30, 60, 120].includes(Number(invite.get('seconds')))
      ? Number(invite.get('seconds'))
      : [30, 60, 120].includes(Number(defaultTime))
        ? Number(defaultTime)
        : 30,
  );
  const [method, setMethod] = useState<Method>(() =>
    ['flow', 'mic', 'type'].includes(invite.get('method') || '')
      ? (invite.get('method') as Method)
      : ['flow', 'mic', 'type'].includes(defaultMethod)
        ? (defaultMethod as Method)
        : 'flow',
  );
  const [phase, setPhase] = useState<Phase>('ready');
  const [text, setText] = useState('');
  const textRef = useRef('');
  const [remaining, setRemaining] = useState(seconds);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(readHistory);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const arena = useRef<HTMLElement>(null);
  const rules = useRef<HTMLElement>(null);
  const deadline = useRef(0);
  const startTime = useRef(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [board, setBoard] = useState<BoardEntry[]>([]);
  const [boardStatus, setBoardStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [boardRefresh, setBoardRefresh] = useState(0);
  const [alias, setAlias] = useState(player);
  const [posted, setPosted] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [copied, setCopied] = useState(false);
  const locked = phase === 'running' || phase === 'settling';
  const count = words(text).length;
  const best = history
    .filter((run) => run.mission === missionId && run.seconds === seconds && run.method === method)
    .reduce((value, run) => Math.max(value, run.score), 0);
  const live = scoreRound(missionId, text, elapsed);
  useEffect(() => {
    if (page === 'home' && new URLSearchParams(location.search).has('preview'))
      document.querySelector('.ob-demo')?.scrollIntoView({ block: 'center' });
  }, [page]);
  useEffect(() => {
    const title = document.title;
    document.title = 'One Breath · Small rounds. Useful words.';
    setSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => {
      document.title = title;
      recognition.current?.abort();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setBoardStatus('loading');
    fetch(`/api/one-breath/leaderboard?mission=${missionId}&seconds=${seconds}&method=${method}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!Array.isArray(data.entries)) throw new Error();
        setBoard(data.entries);
        setBoardStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setBoard([]);
          setBoardStatus('error');
        }
      });
    return () => controller.abort();
  }, [missionId, seconds, method, boardRefresh]);
  useEffect(() => {
    if (phase !== 'running') return;
    const tick = () => {
      const left = Math.max(0, (deadline.current - Date.now()) / 1000);
      setRemaining(left);
      setElapsed(Math.min(seconds, (Date.now() - startTime.current) / 1000));
      if (left <= 0) {
        recognition.current?.stop();
        setPhase('settling');
        setNotice(
          method === 'flow'
            ? 'Time. Stop Flow to let your words arrive, then score your round.'
            : 'Time. Review the captured text, then score your round.',
        );
      }
    };
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [phase, seconds, method]);
  useEffect(() => {
    if (phase === 'running') field.current?.focus({ preventScroll: true });
  }, [phase]);
  useEffect(() => {
    if (!showRules) return;
    const previous = document.activeElement as HTMLElement | null;
    rules.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowRules(false);
      if (event.key === 'Tab') {
        const controls = rules.current?.querySelectorAll<HTMLButtonElement>('button');
        if (!controls?.length) return;
        const first = controls[0],
          last = controls[controls.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === rules.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === rules.current)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
      previous?.focus({ preventScroll: true });
    };
  }, [showRules]);
  const update = (value: string) => {
    textRef.current = value.slice(0, 5000);
    setText(textRef.current);
  };
  const reset = () => {
    recognition.current?.abort();
    recognition.current = null;
    setListening(false);
    setPhase('ready');
    update('');
    setResult(null);
    setRemaining(seconds);
    setElapsed(0);
    setNotice('');
    setSession(null);
    setPosted(false);
    setCopied(false);
  };
  function chooseMission(id: string) {
    reset();
    const next = missions.find((item) => item.id === id)!;
    setMissionId(id);
    setSeconds(next.seconds);
    setRemaining(next.seconds);
  }
  function useMic() {
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!API) {
      setNotice('This browser doesn’t support dictation. Try Wispr Flow or keyboard practice.');
      return;
    }
    recognition.current?.abort();
    const engine = new API();
    recognition.current = engine;
    const prefix = textRef.current;
    engine.lang = 'en-US';
    engine.continuous = true;
    engine.interimResults = true;
    engine.onresult = (event) => {
      const captured = Array.from(event.results)
        .map((item) => item[0].transcript)
        .join(' ');
      update([prefix, captured].filter(Boolean).join(' '));
    };
    engine.onstart = () => {
      setListening(true);
      setNotice('Listening through your browser. Speak naturally.');
    };
    engine.onend = () => setListening(false);
    engine.onerror = (event) => {
      setListening(false);
      setNotice(
        event.error === 'not-allowed'
          ? 'Microphone permission wasn’t granted. You can finish by typing, or reset and choose Flow.'
          : 'The browser microphone stopped. Your words are still here.',
      );
    };
    try {
      engine.start();
    } catch {
      setNotice('Could not start the microphone. Reset to try again, or type your response.');
    }
  }
  async function start() {
    setBusy(true);
    setNotice('');
    setPosted(false);
    try {
      const response = await fetch('/api/one-breath/rounds', {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission: missionId, seconds, method }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not start a shared round.');
      setSession(data);
    } catch {
      setSession(null);
      setNotice('Practice mode: the shared board is unavailable. Your round still works.');
    }
    startTime.current = Date.now();
    deadline.current = startTime.current + seconds * 1000;
    setRemaining(seconds);
    setElapsed(0);
    setPhase('running');
    setBusy(false);
    if (method === 'mic') useMic();
  }
  function finish() {
    recognition.current?.stop();
    if (phase === 'running') {
      setElapsed(Math.min(seconds, (Date.now() - startTime.current) / 1000));
      setPhase('settling');
      setNotice(
        method === 'flow'
          ? 'Stop Flow first, then review what landed. Your timer is paused.'
          : 'Review the captured words before scoring. Your timer is paused.',
      );
      return;
    }
    const outcome = scoreRound(missionId, textRef.current, elapsed);
    setResult(outcome);
    setPhase('result');
    setNotice('');
    const next = [
      ...history,
      { mission: missionId, seconds, method, score: outcome.score, date: new Date().toISOString() },
    ].slice(-100);
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* Private browsing can disallow storage. */
    }
  }
  async function publish() {
    if (!session || !result) return;
    setPosting(true);
    setNotice('');
    try {
      const response = await fetch('/api/one-breath/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...session, alias, text, elapsed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not share your score.');
      setPosted(true);
      setBoardRefresh((value) => value + 1);
      setNotice('You’re on the board. Your transcript was not stored.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not share right now.');
    } finally {
      setPosting(false);
    }
  }
  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(
        `I scored ${result.score}/100 in ${mission.name} on One Breath. ${result.words} captured words · ${seconds}s round · ${methodNames[method]}. An honor-system practice challenge. ${location.origin}/one-breath/`,
      );
      setCopied(true);
    } catch {
      setNotice('Clipboard access is unavailable. You can select and copy your result.');
    }
  }
  const inBudget = count >= mission.minWords && count <= mission.maxWords;
  return (
    <div
      className="ob-app"
      data-page={page}
      data-theme={dark ? 'dark' : 'light'}
      data-quiet={quietMotion}
    >
      <header className="ob-nav">
        <a className="ob-brand" href="/one-breath/" aria-label="One Breath home">
          <Mark />
          <span>
            one breath<span>THE VOICE ARCADE</span>
          </span>
        </a>
        <nav className="ob-product-nav" aria-label="Product navigation">
          <a href="/one-breath/challenge/" aria-current={page === 'challenge' ? 'page' : undefined}>
            Challenges
          </a>
          <a
            href="/one-breath/leaderboard/"
            aria-current={page === 'leaderboard' ? 'page' : undefined}
          >
            Leaderboard
          </a>
          <a
            href="/one-breath/how-to-play/"
            aria-current={page === 'how-to-play' ? 'page' : undefined}
          >
            How to play
          </a>
        </nav>
        <button
          className="ob-theme-toggle"
          onClick={toggleTheme}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <a
          className="ob-settings-link"
          href="/one-breath/settings/"
          aria-label="Settings"
          aria-current={page === 'settings' ? 'page' : undefined}
        >
          <Settings size={18} />
        </a>
        <a
          className="ob-portfolio-link"
          href="/"
          aria-label="Back to Portfolio"
          onClick={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            event.preventDefault();
            event.stopPropagation();
            window.location.assign('/');
          }}
        >
          Portfolio
          <span className="ob-portfolio-hint" role="tooltip">
            Back to Portfolio
          </span>
        </a>
      </header>
      <main>
        {page === 'home' && (
          <section className="ob-launch-hero" aria-labelledby="ob-title">
            <div className="ob-hero-timer" aria-hidden="true">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="33" />
                <circle className="ob-timer-trace" cx="40" cy="40" r="33" />
              </svg>
              <span>
                30<small>SECONDS</small>
              </span>
            </div>
            <div className="ob-hero-best" aria-hidden="true">
              <Trophy size={19} strokeWidth={1.3} />
              <span>
                A LITTLE BETTER<small>Every round.</small>
              </span>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="ob-hero-words" aria-hidden="true">
              <span className="ob-word-line">
                <i />
                <i />
                <i />
              </span>
              <span className="ob-word-line">
                <i />
                <i />
              </span>
              <span className="ob-word-line">
                <i />
                <i />
                <i />
              </span>
              <span className="ob-word-cursor" />
            </div>
            <div className="ob-hero-signal" aria-hidden="true">
              <div className="ob-signal-bars">
                {[14, 24, 38, 52, 32, 64, 46, 28, 40, 22, 12].map((height, index) => (
                  <i key={index} style={{ height, animationDelay: `${index * -0.21}s` }} />
                ))}
              </div>
              <span className="ob-signal-ring ob-signal-ring-one" />
              <span className="ob-signal-ring ob-signal-ring-two" />
              <span className="ob-signal-ring ob-signal-ring-three" />
            </div>
            <div className="ob-launch-heading">
              <span className="ob-eyebrow">ONE BREATH / A VOICE PRACTICE GAME</span>
              <h1 id="ob-title">
                A small round.
                <br />
                <em>A stronger voice.</em>
              </h1>
              <p>
                Pick a task. Speak for 30 to 120 seconds. Review your words and challenge a friend.
              </p>
              <div className="ob-launch-actions">
                <a className="ob-primary" href="/one-breath/challenge/">
                  <Mic size={17} />
                  Play your first round
                </a>
                <a href="/one-breath/how-to-play/">See how it works</a>
              </div>
              <span className="ob-launch-note">
                Use installed Wispr Flow, your browser mic or your keyboard. No account needed.
              </span>
            </div>
            <div className="ob-launch-playground ob-demo" data-playing={previewPlaying}>
              <div className="ob-launch-rail">
                <span>CHOOSE YOUR PRACTICE</span>
                <button
                  className="ob-preview-play"
                  onClick={() => setPreviewPlaying((value) => !value)}
                  aria-label={previewPlaying ? 'Pause example animation' : 'Play example animation'}
                >
                  {previewPlaying ? 'Pause preview' : 'Play preview'}
                </button>
              </div>
              <div className="ob-launch-missions" aria-label="Preview a mission">
                {demos.map((item, i) => (
                  <button
                    key={item.label}
                    aria-pressed={demo === i}
                    onClick={() => {
                      setDemo(i);
                      setRevealed(false);
                    }}
                  >
                    <span>0{i + 1}</span>
                    <strong>{item.label}</strong>
                    <small>{item.time}</small>
                  </button>
                ))}
              </div>
              <div className="ob-launch-stage" data-preview={revealed ? 'review' : 'speak'}>
                <div className="ob-launch-dial">
                  <div className="ob-launch-wave" aria-hidden="true">
                    {revealed ? (
                      <Check size={28} strokeWidth={1.5} />
                    ) : (
                      Array.from({ length: 19 }, (_, i) => (
                        <i
                          key={i}
                          style={{
                            height: `${7 + Math.abs(Math.sin(i * 1.6)) * 30}px`,
                            animationDelay: `${i * 70}ms`,
                          }}
                        />
                      ))
                    )}
                  </div>
                  <span>{revealed ? 'REVIEW YOUR WORDS' : 'THINK OUT LOUD'}</span>
                  <small>One useful message at a time</small>
                </div>
                <div className="ob-launch-message">
                  <span className="ob-eyebrow">
                    {revealed ? 'PREPARED EXAMPLE' : demos[demo].task.toUpperCase()}
                  </span>
                  <p key={`${demo}-${revealed}`}>
                    {revealed ? demos[demo].clean : demos[demo].raw}
                  </p>
                  <button
                    onClick={() => {
                      setPreviewPlaying(false);
                      setRevealed((v) => !v);
                    }}
                  >
                    {revealed ? 'Show the rough thought again' : 'Reveal the prepared example'}
                  </button>
                  <small>Prepared comparison, not live transcription or AI feedback.</small>
                </div>
              </div>
            </div>
          </section>
        )}
        {page === 'home' && (
          <section className="ob-replay" aria-labelledby="ob-replay-title">
            <div className="ob-replay-heading">
              <div>
                <span className="ob-eyebrow">REPLAY STUDIO / INTERACTIVE EXAMPLES</span>
                <h2 id="ob-replay-title">Same update. A clearer story.</h2>
                <p>Compare two team updates. See what structure adds.</p>
              </div>
              <div className="ob-replay-switch" aria-label="Choose an example attempt">
                <button aria-pressed={replay === 0} onClick={() => setReplay(0)}>
                  First attempt
                </button>
                <button aria-pressed={replay === 1} onClick={() => setReplay(1)}>
                  Improved attempt
                </button>
              </div>
            </div>
            <div className="ob-replay-stage">
              <div>
                <span className="ob-eyebrow">30-SECOND TEAM UPDATE · ATTEMPT 0{replay + 1}</span>
                <p key={replay}>
                  {replay
                    ? 'I finished the login UI today. Mobile authentication is still failing, so I’m debugging the callback. Next, I’ll test the fix on two devices.'
                    : 'I worked on the login feature today. There are a few problems and I’ll keep working on it.'}
                </p>
              </div>
              <ul>
                {['What changed', 'What’s blocked', 'What’s next'].map((label, i) => (
                  <li key={label} data-detected={replay === 1}>
                    <span>{replay ? <Check size={15} /> : '○'}</span>
                    <div>
                      <strong>{label}</strong>
                      <small>
                        {replay
                          ? ['Login UI finished', 'Mobile authentication', 'Test on two devices'][i]
                          : ['Vague progress', 'No specific blocker', 'No concrete next step'][i]}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <small className="ob-replay-note">
              Illustrative answers with manually defined checklist statuses. This comparison does
              not assess your response.
            </small>
          </section>
        )}
        {page === 'challenge' && player && (
          <section
            ref={arena}
            className="ob-arcade ob-focused-challenge"
            aria-labelledby="ob-arcade-title"
          >
            {showStartGuide && (
              <div className="ob-start-guide">
                <button
                  className="ob-dismiss-guide"
                  aria-label="Dismiss Flow setup notice"
                  onClick={() => {
                    setShowStartGuide(false);
                    try {
                      localStorage.setItem('one-breath-guide-dismissed', 'true');
                    } catch {}
                  }}
                >
                  <X size={17} />
                </button>
                <div>
                  <span className="ob-eyebrow">BEFORE YOUR FIRST ROUND</span>
                  <h2>Have Wispr Flow ready?</h2>
                  <p>
                    Install Flow, click the response field and use your Flow shortcut. No Flow yet?
                    Explore the example or practise with your keyboard.
                  </p>
                </div>
                <div>
                  <a
                    className="ob-secondary"
                    href="https://wisprflow.ai/r/PRANAV1166"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download Flow
                  </a>
                  <a href="/one-breath/?preview=1">Explore an example</a>
                  <button className="ob-text-button" onClick={() => setMethod('type')}>
                    Practise with keyboard
                  </button>
                </div>
              </div>
            )}
            {inviter && (
              <section className="ob-match-banner" aria-label="Invited challenge">
                <div>
                  <span className="ob-eyebrow">
                    {acceptedBy === player ? 'CHALLENGE ACCEPTED' : 'YOU’RE INVITED'}
                  </span>
                  <h2>
                    {inviter} <span>vs.</span> {player}
                  </h2>
                  <p>
                    {mission.name} · {seconds} seconds
                    {invite.get('beat') && /^\d{1,3}$/.test(invite.get('beat')!)
                      ? ` · ${Math.min(100, Number(invite.get('beat')))}/100 to beat`
                      : ''}
                  </p>
                </div>
                {acceptedBy !== player ? (
                  <button className="ob-primary" onClick={() => acceptInvitation(player)}>
                    Accept as {player}
                  </button>
                ) : (
                  <span className="ob-match-accepted">
                    <Check size={15} />
                    You’re in, {player}
                  </span>
                )}
              </section>
            )}
            <div className="ob-player-bar">
              <span>
                <span className="ob-player-avatar" aria-hidden="true">
                  {photo ? (
                    <img src={photo} alt="" />
                  ) : avatar === '✦' ? (
                    player.slice(0, 1).toUpperCase()
                  ) : (
                    avatar
                  )}
                </span>{' '}
                Ready, {player}?{' '}
                <button
                  className="ob-text-button"
                  disabled={locked}
                  onClick={() => {
                    setPlayer('');
                    setNameDraft('');
                    try {
                      localStorage.removeItem('one-breath-player');
                      sessionStorage.removeItem('one-breath-player');
                    } catch {}
                  }}
                >
                  Change name
                </button>
              </span>
              <button
                className="ob-secondary"
                onClick={() => {
                  setShowInvite((v) => !v);
                  arena.current?.scrollIntoView({ behavior: quietMotion ? 'instant' : 'smooth' });
                }}
              >
                Challenge your friend
              </button>
            </div>
            {showInvite && (
              <div
                className="ob-invite-overlay"
                onClick={(event) => {
                  if (event.target === event.currentTarget) setShowInvite(false);
                }}
              >
                <section
                  className="ob-invite-dialog"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="ob-invite-title"
                  onKeyDown={(event) => {
                    if (event.key !== 'Tab') return;
                    const buttons = Array.from(
                      event.currentTarget.querySelectorAll<HTMLButtonElement>('button'),
                    );
                    const first = buttons[0],
                      last = buttons[buttons.length - 1];
                    if (event.shiftKey && document.activeElement === first) {
                      event.preventDefault();
                      last?.focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                      event.preventDefault();
                      first?.focus();
                    }
                  }}
                >
                  <button
                    className="ob-invite-close"
                    aria-label="Close invitation"
                    onClick={() => setShowInvite(false)}
                  >
                    <X size={18} />
                  </button>
                  <span className="ob-eyebrow">BETTER WITH A FRIEND</span>
                  <h2 id="ob-invite-title">A little friendly competition.</h2>
                  <p>Send the same round. See what they make of it.</p>
                  <div className="ob-invite-people">
                    <div>
                      <span>{player.slice(0, 1).toUpperCase()}</span>
                      <strong>{player}</strong>
                      <small>You</small>
                    </div>
                    <span className="ob-invite-versus">vs.</span>
                    <div>
                      <span>?</span>
                      <strong>Your friend</strong>
                      <small>They choose their nickname</small>
                    </div>
                  </div>
                  <div className="ob-invite-round">
                    <strong>{mission.name}</strong>
                    <span>
                      {seconds} seconds · {methodNames[method]}
                    </span>
                    <small>
                      {result
                        ? `Your score to beat: ${result.score}/100`
                        : 'Share this mission now, or finish a round to include your score.'}
                    </small>
                  </div>
                  <button autoFocus className="ob-primary" onClick={copyInvitation}>
                    {inviteCopied ? 'Link copied' : 'Copy invitation link'}
                  </button>
                  <small className="ob-invite-disclosure">
                    Your nickname{result ? ' and score are' : ' is'} included in the link. Your
                    friend enters their own name when accepting. Acceptance stays on their device.
                  </small>
                </section>
              </div>
            )}
            <div className="ob-section-header">
              <div>
                <h2 id="ob-arcade-title">Your next round.</h2>
                <p className="ob-challenge-intro">
                  Choose a task. Find your words. Make them count.
                </p>
              </div>
              <div className="ob-personal">
                <Trophy size={17} />
                <span>
                  <strong>{history.length}</strong> {history.length === 1 ? 'round' : 'rounds'} on
                  this device
                </span>
                {history.length > 0 && (
                  <button
                    className="ob-reset-stats"
                    aria-label="Reset local practice stats"
                    disabled={locked}
                    onClick={() => {
                      setHistory([]);
                      try {
                        localStorage.removeItem(HISTORY_KEY);
                      } catch {
                        /* Storage may be unavailable. */
                      }
                    }}
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
              </div>
            </div>
            <div className="ob-challenge-workspace">
              <div className="ob-missions" aria-label="Challenge selection">
                {missions.map((item, index) => {
                  return (
                    <button
                      key={item.id}
                      className={missionId === item.id ? 'is-selected' : ''}
                      onClick={() => chooseMission(item.id)}
                      disabled={locked || busy}
                      aria-pressed={missionId === item.id}
                    >
                      <span className="ob-mission-number">0{index + 1}</span>
                      <span>
                        <strong>{['Team update', 'Interview', 'Read-back'][index]}</strong>
                      </span>
                      <span className="ob-choice-dot">
                        {missionId === item.id && <Check size={12} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div
                className={`ob-arena ob-practice-desk ob-focus-desk ${phase === 'result' ? 'ob-show-result' : ''}`}
              >
                <div className="ob-arena-top">
                  <span>
                    <span className={`ob-status-dot ${phase === 'running' ? 'is-live' : ''}`} />
                    {phase === 'ready'
                      ? 'Ready to begin'
                      : phase === 'running'
                        ? 'Round in progress'
                        : phase === 'settling'
                          ? 'Review your words'
                          : 'Round complete'}
                  </span>
                  <span>
                    {best ? `Personal best: ${best}/100` : `${seconds}-second practice round`}
                  </span>
                </div>
                {phase !== 'result' ? (
                  <>
                    <div className="ob-game-grid">
                      <aside className="ob-brief">
                        <span className="ob-eyebrow">THE TASK</span>
                        <h3>{mission.title}</h3>
                        <p>{mission.prompt}</p>
                        {mission.reference ? (
                          <div className="ob-reference">
                            <small>READ THIS MESSAGE</small>
                            <p>{mission.reference}</p>
                          </div>
                        ) : (
                          <ul className="ob-objectives">
                            {mission.facts.map((fact, index) => (
                              <li key={fact}>
                                <span className={live.checked[index]?.passed ? 'is-detected' : ''}>
                                  {live.checked[index]?.passed ? (
                                    <Check size={12} />
                                  ) : (
                                    `0${index + 1}`
                                  )}
                                </span>
                                {fact}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="ob-brief-note">
                          <span>
                            {mission.reference
                              ? 'Text match only. Your accent is not graded.'
                              : 'Hints light up when matching words appear. Meaning still needs your review.'}
                          </span>
                        </div>
                      </aside>
                      <div className="ob-play">
                        <div className="ob-play-top">
                          <div>
                            <span className="ob-eyebrow">THE PRACTICE</span>
                            <h3>
                              {phase === 'ready'
                                ? 'Your response'
                                : phase === 'settling'
                                  ? 'Review your response'
                                  : 'Think out loud'}
                            </h3>
                          </div>
                          <div
                            className="ob-timer"
                            role="timer"
                            aria-label={`${Math.ceil(remaining)} seconds remaining`}
                          >
                            <svg viewBox="0 0 72 72" aria-hidden="true">
                              <circle cx="36" cy="36" r="31" />
                              <circle
                                cx="36"
                                cy="36"
                                r="31"
                                pathLength="100"
                                strokeDasharray="100"
                                strokeDashoffset={100 - (remaining / seconds) * 100}
                              />
                            </svg>
                            <strong>
                              {Math.ceil(remaining)}
                              <small>SEC</small>
                            </strong>
                          </div>
                        </div>
                        <div className="ob-settings">
                          <div className="ob-methods" aria-label="Input method">
                            {(['flow', 'mic', 'type'] as Method[]).map((value) => (
                              <button
                                key={value}
                                aria-pressed={method === value}
                                disabled={locked || busy || (value === 'mic' && !supported)}
                                onClick={() => {
                                  setMethod(value);
                                  setNotice('');
                                }}
                              >
                                {value === 'flow' ? (
                                  <img src="/images/wispr-flow-mark.webp" alt="" />
                                ) : value === 'mic' ? (
                                  <Mic size={14} />
                                ) : (
                                  <Keyboard size={14} />
                                )}
                                <span>
                                  {value === 'flow'
                                    ? 'With Flow'
                                    : value === 'mic'
                                      ? 'Use mic'
                                      : 'Type'}
                                </span>
                              </button>
                            ))}
                          </div>
                          <div className="ob-durations" aria-label="Round duration">
                            {durations.map((value) => (
                              <button
                                key={value}
                                aria-pressed={seconds === value}
                                disabled={locked || busy}
                                onClick={() => {
                                  setSeconds(value);
                                  setRemaining(value);
                                }}
                              >
                                {value === 120 ? '2m' : `${value}s`}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="ob-method-help">
                          {method === 'flow' ? (
                            <>
                              Start the round, focus the response field and use your Flow shortcut.
                            </>
                          ) : method === 'mic' ? (
                            <>
                              Your browser will ask for microphone access. It may send audio to its
                              speech service.
                            </>
                          ) : (
                            <>Keyboard practice. Same mission, a separate leaderboard.</>
                          )}
                        </div>
                        <label className="ob-field-label" htmlFor="ob-response">
                          {method === 'flow'
                            ? 'YOUR RESPONSE'
                            : method === 'mic'
                              ? 'YOUR CAPTURED WORDS'
                              : 'YOUR RESPONSE'}
                          <span>{count} words</span>
                        </label>
                        <textarea
                          id="ob-response"
                          ref={field}
                          value={text}
                          disabled={phase === 'ready'}
                          maxLength={5000}
                          onChange={(event) => update(event.target.value)}
                          placeholder={
                            phase === 'ready'
                              ? 'Your next useful message starts here.'
                              : method === 'flow'
                                ? 'Click here, activate Flow and speak. Your words arrive when you stop Flow.'
                                : 'Your words go here. Make the message yours.'
                          }
                        />
                        <div className="ob-word-budget">
                          <span className={inBudget ? 'is-in-budget' : ''}>
                            {mission.minWords}–{mission.maxWords} words{' '}
                            {inBudget && <Check size={12} />}
                          </span>
                          <button type="button" onClick={() => setShowRules(true)}>
                            How points work
                          </button>
                        </div>
                        <div className="ob-round-actions">
                          {phase === 'ready' ? (
                            <button className="ob-primary" disabled={busy} onClick={start}>
                              {busy ? 'Setting the stage…' : 'Start my round'}
                              <AudioLines size={18} />
                            </button>
                          ) : (
                            <>
                              <button
                                className="ob-primary"
                                disabled={phase === 'settling' && count < 3}
                                onClick={finish}
                              >
                                {phase === 'settling' ? 'Score my round' : 'Finish round'}
                                <Flag size={17} />
                              </button>
                              {phase === 'running' && method === 'mic' && !listening && (
                                <button className="ob-text-button" onClick={useMic}>
                                  Resume mic
                                </button>
                              )}
                              <button className="ob-reset" onClick={reset} aria-label="Reset round">
                                <RotateCcw size={16} />
                              </button>
                            </>
                          )}
                        </div>
                        <p className="ob-input-note">
                          {method === 'flow' ? (
                            <>
                              Uses your installed Wispr Flow app.{' '}
                              <a
                                href="https://wisprflow.ai/r/PRANAV1166"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Get Flow
                              </a>
                              . You can also type.
                            </>
                          ) : method === 'mic' ? (
                            'Browser dictation. No AI cleanup or pronunciation assessment.'
                          ) : (
                            'Practice your message before trying it with voice.'
                          )}
                        </p>
                        <p className="ob-round-status" role="status">
                          {notice || '\u00a0'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  result && (
                    <div className="ob-result">
                      <div className="ob-result-summary">
                        <span className="ob-result-spark"></span>
                        <span className="ob-eyebrow">
                          {mission.category} · {seconds}S ROUND
                        </span>
                        <h3>{result.badge}.</h3>
                        <div className="ob-big-score">
                          {result.score}
                          <span>/ 100</span>
                        </div>
                        <p>Mission points. One useful attempt, in your own words.</p>
                        <div className="ob-result-numbers">
                          <span>
                            <strong>{result.words}</strong>captured words
                          </span>
                          <span>
                            <strong>{result.elapsed}s</strong>round time
                          </span>
                          <span>
                            <strong>{result.outputRate ?? 'n/a'}</strong>words / round minute
                          </span>
                        </div>
                        <small>
                          Output rate includes pauses and edits. It is not measured speaking speed.
                        </small>
                        <div className="ob-result-buttons">
                          <button className="ob-primary" onClick={reset}>
                            Play it again
                            <RotateCcw size={16} />
                          </button>
                          <button
                            className="ob-secondary"
                            onClick={() => {
                              setShowInvite((v) => !v);
                              arena.current?.scrollIntoView({
                                behavior: quietMotion ? 'instant' : 'smooth',
                              });
                            }}
                          >
                            Challenge your friend
                          </button>
                          <button className="ob-secondary" onClick={copyResult}>
                            <Copy size={15} />
                            {copied ? 'Copied' : 'Copy score'}
                          </button>
                        </div>
                      </div>
                      <div className="ob-result-detail">
                        <span className="ob-eyebrow">A LITTLE FEEDBACK</span>
                        {result.reference ? (
                          <>
                            <h4>
                              {result.reference.matched} of {result.reference.total} reference words
                              matched.
                            </h4>
                            <div className="ob-word-match">
                              {result.reference.tokens.map((token, index) => (
                                <span key={index} className={token.matched ? 'matched' : 'missing'}>
                                  {token.word}{' '}
                                </span>
                              ))}
                            </div>
                            <p>
                              Words are matched in order, ignoring case and punctuation.{' '}
                              {result.reference.extra} extra words. This does not assess
                              pronunciation.
                            </p>
                          </>
                        ) : (
                          <>
                            <h4>
                              {result.checked.filter((check) => check.passed).length} of 3 signals
                              detected.
                            </h4>
                            <ul className="ob-result-checks">
                              {result.checked.map((check) => (
                                <li key={check.label} className={check.passed ? 'passed' : ''}>
                                  <span>
                                    {check.passed ? <Check size={14} /> : <Flag size={14} />}
                                  </span>
                                  {check.label}
                                  <small>{check.passed ? 'Detected' : 'Try adding this'}</small>
                                </li>
                              ))}
                            </ul>
                            <p>
                              {result.withinBudget
                                ? 'You stayed in the word budget. Read your message once to check that it says what you mean.'
                                : `Try a message between ${mission.minWords} and ${mission.maxWords} words next time.`}{' '}
                              This is a word-based checklist, not an AI interview rating.
                            </p>
                          </>
                        )}
                        <div className="ob-result-message">
                          <span>
                            <CheckCheck size={14} /> YOUR MESSAGE
                          </span>
                          <p>{text}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}
        {(page === 'leaderboard' || (page === 'challenge' && phase === 'result')) && (
          <section className="ob-board-section" aria-labelledby="ob-board-title">
            <div className="ob-section-header">
              <div>
                <span className="ob-eyebrow">A LITTLE FRIENDLY COMPETITION</span>
                <h2 id="ob-board-title">Small wins. Real players.</h2>
                <p className="ob-board-intro">
                  Your next personal best belongs here. Pick a league and make your mark.
                </p>
              </div>
              <span className="ob-board-filter">
                {mission.name} · {seconds}s · {methodNames[method]}
              </span>
            </div>
            {page === 'leaderboard' && (
              <div className="ob-league-summary">
                <div>
                  <Trophy size={22} />
                  <span>
                    TOP SCORE
                    <strong>{board.length ? `${board[0].score}/100` : 'Be the first'}</strong>
                  </span>
                </div>
                <div>
                  <AudioLines size={22} />
                  <span>
                    THIS LEAGUE<strong>{seconds}-second rounds</strong>
                  </span>
                </div>
                <div>
                  <Flag size={22} />
                  <span>
                    FORMAT<strong>Personal bests, friendly rivalry</strong>
                  </span>
                </div>
              </div>
            )}
            <div className="ob-board-controls">
              <label>
                Mission
                <select
                  aria-label="Leaderboard mission"
                  value={missionId}
                  onChange={(e) => setMissionId(e.target.value)}
                >
                  {missions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Duration
                <select
                  aria-label="Leaderboard duration"
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                >
                  {[30, 60, 120].map((n) => (
                    <option key={n} value={n}>
                      {n} seconds
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Input
                <select
                  aria-label="Leaderboard input"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                >
                  {Object.entries(methodNames).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="ob-board-layout">
              <div className="ob-board">
                <div className="ob-board-head">
                  <span>PLAYER</span>
                  <span>WORDS</span>
                  <span>POINTS</span>
                </div>
                {boardStatus === 'loading' ? (
                  <div className="ob-board-empty">
                    <span className="ob-empty-icon">
                      <Trophy size={22} />
                    </span>
                    <p>Checking the board…</p>
                  </div>
                ) : boardStatus === 'error' ? (
                  <div className="ob-board-empty">
                    <p>The board is taking a breather.</p>
                    <button
                      className="ob-text-button"
                      onClick={() => setBoardRefresh((value) => value + 1)}
                    >
                      Try again
                    </button>
                  </div>
                ) : board.length === 0 ? (
                  <div className="ob-board-empty">
                    <span className="ob-empty-icon">
                      <Trophy size={22} />
                    </span>
                    <h3>The first spot is open.</h3>
                    <p>
                      No scores for this round yet.
                      <br />
                      Play a mission and set the first mark.
                      <a className="ob-board-play" href="/one-breath/challenge/">
                        Play for your place
                      </a>
                    </p>
                  </div>
                ) : (
                  <ol>
                    {board.map((entry, index) => (
                      <li key={entry.id}>
                        <span>
                          <small>{String(index + 1).padStart(2, '0')}</small>
                          <strong>{entry.alias}</strong>
                          {entry.id === session?.id && <em>YOU</em>}
                        </span>
                        <span>{entry.words}</span>
                        <strong>
                          {entry.score}
                          <small>/100</small>
                        </strong>
                      </li>
                    ))}
                  </ol>
                )}
                <p className="ob-board-disclaimer">
                  Real submitted rounds. Separate boards for each mission, time and input method.
                  Honor system: voice use and identity are not verified.
                </p>
              </div>
              <aside className="ob-publish">
                <span className="ob-eyebrow">KEEP IT FRIENDLY</span>
                <h3>{posted ? 'Your mark is on the board.' : 'A nickname. A small win.'}</h3>
                <p>Try to beat your own best first. Sharing your score is always optional.</p>
                {phase === 'result' && session && !posted ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void publish();
                    }}
                  >
                    <label htmlFor="ob-alias">Your public nickname</label>
                    <input
                      id="ob-alias"
                      value={alias}
                      onChange={(event) => setAlias(event.target.value)}
                      minLength={2}
                      maxLength={24}
                      required
                      placeholder="e.g. quietbuilder"
                    />
                    <button className="ob-secondary" disabled={posting || elapsed < 5}>
                      {posting ? 'Saving…' : 'Publish my score'}
                      <Trophy size={15} />
                    </button>
                    {elapsed < 5 && (
                      <small>
                        Public scores require at least 5 seconds of practice. Replay to share a
                        score.
                      </small>
                    )}
                    <small>
                      Your text is sent to calculate points, then discarded. Only your nickname,
                      score and round stats are stored publicly. No audio is uploaded by this site.
                    </small>
                  </form>
                ) : (
                  <div className="ob-publish-placeholder">
                    <Flag size={18} />
                    <span>
                      {posted
                        ? 'Try another mission or challenge a friend.'
                        : phase === 'result' && !session
                          ? 'Shared board unavailable for this practice run.'
                          : 'Complete a round to share your score.'}
                    </span>
                  </div>
                )}
                {notice && phase === 'result' && (
                  <p className="ob-notice" role="status">
                    {notice}
                  </p>
                )}
                <div className="ob-practice-points">
                  <span>
                    Points are for practice.
                    <br />
                    <strong>No cash, credits or prizes.</strong>
                  </span>
                </div>
              </aside>
            </div>
          </section>
        )}
        {page === 'home' && (
          <section className="ob-home-leagues">
            <div>
              <span className="ob-eyebrow">A LITTLE FRIENDLY COMPETITION</span>
              <h2>Your next personal best starts here.</h2>
              <p>Same mission. Same time. Your own words.</p>
              <a className="ob-secondary" href="/one-breath/leaderboard/">
                Explore the leaderboard
              </a>
            </div>
            <div className="ob-league-tickets">
              {missions.map((m, i) => (
                <a key={m.id} href={`/one-breath/challenge/?mission=${m.id}&seconds=${m.seconds}`}>
                  <span>0{i + 1}</span>
                  <strong>{m.name}</strong>
                  <small>{m.seconds}s</small>
                </a>
              ))}
            </div>
          </section>
        )}
        {page === 'home' && (
          <section className="ob-flow-note">
            <img src="/images/wispr-flow-mark.webp" alt="" />
            <div>
              <h2>Let the thought flow.</h2>
              <p>
                One Breath supplies the game. Your installed Wispr Flow app puts your words in the
                field. The cleanup comes from Flow, not this website. My referral link is below;
                check Flow’s page for current offer terms.
              </p>
            </div>
            <a
              href="https://wisprflow.ai/r/PRANAV1166"
              target="_blank"
              rel="noreferrer"
              className="ob-secondary"
            >
              Try Flow
            </a>
          </section>
        )}
        {page === 'challenge' && !player && (
          <section className="ob-welcome ob-welcome-redesign">
            <div className="ob-welcome-entry">
              <span className="ob-welcome-symbol" aria-hidden="true">
                <Mark />
              </span>
              <span className="ob-eyebrow">YOUR NEXT SMALL WIN</span>
              <h1>What should we call you?</h1>
              <p>A nickname is all you need. No account, no sign-up.</p>
              {invite.get('from') && (
                <p className="ob-invitation">
                  {invite.get('from')?.slice(0, 24)} invited you to a {seconds}-second round
                  {invite.get('beat') && /^\d{1,3}$/.test(invite.get('beat')!)
                    ? ` · score to beat: ${Math.min(100, Number(invite.get('beat')))}/100`
                    : ''}
                  .
                </p>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = nameDraft.trim();
                  if (name.length < 2) return;
                  setPlayer(name);
                  setAlias(name);
                  if (inviter) acceptInvitation(name);
                  try {
                    localStorage.setItem('one-breath-player', name);
                  } catch {}
                }}
              >
                <label htmlFor="ob-player">Your name or nickname</label>
                <input
                  id="ob-player"
                  autoComplete="nickname"
                  minLength={2}
                  maxLength={24}
                  required
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="e.g. Pranav"
                />
                <button className="ob-primary">
                  {inviter ? 'Accept challenge and continue' : 'Let’s start the challenge'}
                </button>
                <small className="ob-name-privacy">
                  Saved in this browser. Only shared if you publish a score or send an invitation.
                </small>
              </form>
              <a className="ob-welcome-help" href="/one-breath/how-to-play/">
                How to play
              </a>
            </div>
            <aside className="ob-welcome-flow">
              <span className="ob-eyebrow">READY WHEN YOU ARE</span>
              <div className="ob-welcome-steps" aria-label="Your first round">
                <span>
                  <i>01</i>Pick a mission
                </span>
                <span>
                  <i>02</i>Say it in your own words
                </span>
                <span>
                  <i>03</i>Review your round
                </span>
              </div>
              <div className="ob-welcome-flow-intro">
                <strong>New to Wispr Flow?</strong>
                <p>Use Flow to dictate into the challenge. Keyboard practice works too.</p>
                <a
                  className="ob-welcome-download"
                  href="https://wisprflow.ai/r/PRANAV1166"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Flow
                </a>
                <a className="ob-welcome-example" href="/one-breath/?preview=1">
                  Explore an example
                </a>
              </div>
            </aside>
          </section>
        )}
        {page === 'settings' && (
          <section className="ob-settings-page">
            <span className="ob-eyebrow">MAKE YOURSELF AT HOME</span>
            <h1>Small preferences.</h1>
            <p>A quieter space, your way. Settings stay in this browser.</p>
            <div className="ob-preference">
              <div>
                <h2>Appearance</h2>
                <p>{dark ? 'Warm charcoal' : 'Warm ivory'} with a lavender accent.</p>
              </div>
              <button className="ob-secondary" onClick={toggleTheme}>
                {dark ? 'Use light theme' : 'Use dark theme'}
              </button>
            </div>
            <div className="ob-preference">
              <div>
                <h2>Less motion</h2>
                <p>Pause decorative waveform animations.</p>
              </div>
              <input
                aria-label="Less motion"
                type="checkbox"
                checked={quietMotion}
                onChange={(e) => {
                  setQuietMotion(e.target.checked);
                  try {
                    localStorage.setItem('one-breath-quiet-motion', String(e.target.checked));
                  } catch {}
                }}
              />
            </div>
            <form
              className="ob-name-preference"
              onSubmit={(e) => {
                e.preventDefault();
                const next = nameDraft.trim();
                if (next.length < 2) return;
                setPlayer(next);
                setAlias(next);
                try {
                  localStorage.setItem('one-breath-player', next);
                } catch {}
                setSettingsNotice('Name saved on this browser.');
              }}
            >
              <label htmlFor="ob-settings-name">Your name or nickname</label>
              <div>
                <input
                  id="ob-settings-name"
                  minLength={2}
                  maxLength={24}
                  required
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Choose a nickname"
                />
                <button className="ob-secondary">Save nickname</button>
              </div>
              <small>Only public if you publish a score or share an invitation.</small>
            </form>
            <div className="ob-avatar-preference">
              <div>
                <h2>Your profile icon</h2>
                <p>Stored locally. Your photo is never included in public scores or invitations.</p>
              </div>
              <div className="ob-avatar-choices" aria-label="Choose a profile icon">
                {['✦', '◉', '☺', '♬', '☾', '⌘'].map((icon) => (
                  <button
                    key={icon}
                    aria-label={`Use ${icon} icon`}
                    aria-pressed={!photo && avatar === icon}
                    onClick={() => saveAvatar(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="ob-photo-control">
                <span className="ob-player-avatar" aria-hidden="true">
                  {photo ? (
                    <img src={photo} alt="" />
                  ) : avatar === '✦' ? (
                    player.slice(0, 1).toUpperCase()
                  ) : (
                    avatar
                  )}
                </span>
                <label htmlFor="ob-profile-photo">
                  Choose a photo
                  <input
                    id="ob-profile-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => uploadPhoto(e.target.files?.[0])}
                  />
                </label>
                <button
                  className="ob-text-button"
                  disabled={!photo}
                  onClick={() => saveAvatar(avatar)}
                >
                  Remove photo
                </button>
              </div>
              <small>JPG, PNG or WebP, up to 400 KB. Nothing is uploaded.</small>
              <p className="ob-photo-status" role="status">
                {photoNotice}
              </p>
            </div>
            <div className="ob-preference">
              <div>
                <h2>Default round</h2>
                <p>Your starting time for a new challenge.</p>
              </div>
              <select
                aria-label="Default round duration"
                value={defaultTime}
                onChange={(e) => {
                  setDefaultTime(e.target.value);
                  try {
                    localStorage.setItem('one-breath-default-time', e.target.value);
                  } catch {}
                  setSettingsNotice('Default round saved.');
                }}
              >
                {[30, 60, 120].map((t) => (
                  <option key={t} value={t}>
                    {t} seconds
                  </option>
                ))}
              </select>
            </div>
            <div className="ob-preference">
              <div>
                <h2>Preferred input</h2>
                <p>Choose how you usually put words on the page.</p>
              </div>
              <select
                aria-label="Preferred input"
                value={defaultMethod}
                onChange={(e) => {
                  setDefaultMethod(e.target.value);
                  try {
                    localStorage.setItem('one-breath-default-method', e.target.value);
                  } catch {}
                  setSettingsNotice('Preferred input saved.');
                }}
              >
                {Object.entries(methodNames).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="ob-preference">
              <div>
                <h2>Your practice history</h2>
                <p>
                  {history.length} completed rounds saved on this device. Public scores are
                  separate.
                </p>
              </div>
              <button
                className="ob-secondary"
                onClick={() => {
                  setHistory([]);
                  setSettingsNotice('Local practice history cleared. Public scores are unchanged.');
                  try {
                    localStorage.removeItem(HISTORY_KEY);
                  } catch {}
                }}
              >
                Clear local history
              </button>
            </div>
            <div className="ob-settings-privacy">
              <h2>Your words, your choice.</h2>
              <p>
                Practice history and preferences stay in this browser. Publishing sends your text to
                this server to recalculate points, then discards it. Public nickname and round stats
                are stored. This website does not upload audio; Flow and browser dictation follow
                their providers’ policies.
              </p>
              <a href="/one-breath/how-to-play/">Understand scoring and fairness</a>
            </div>
            <p className="ob-settings-notice" role="status">
              {settingsNotice}
            </p>
          </section>
        )}
        {page === 'how-to-play' && (
          <section className="ob-guide">
            <span className="ob-eyebrow">HOW TO PLAY</span>
            <h1>A small challenge. A useful result.</h1>
            <div className="ob-guide-steps">
              {[
                [
                  '01',
                  'Make it yours',
                  'Enter a nickname, choose a mission and select a 30, 60 or 120-second round.',
                ],
                [
                  '02',
                  'Take the mic',
                  'Choose With Flow to use your installed Wispr Flow shortcut in the response field. Browser microphone and typing are also available.',
                ],
                [
                  '03',
                  'Review and score',
                  'Stop Flow, review the captured text, then score. Points reward mission keywords and word budget, or ordered text matching in read-back.',
                ],
                [
                  '04',
                  'Challenge your friend',
                  'Copy an invitation with the same mission, duration and your score to beat. Public leaderboard sharing is optional.',
                ],
              ].map(([n, title, body]) => (
                <article key={n}>
                  <span>{n}</span>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <p>
              Scores use transparent text rules. They do not assess pronunciation, speaking
              duration, factual accuracy or interview quality. This version has no live AI judge.
              Points have no cash or credit value.
            </p>
            <a className="ob-primary" href="/one-breath/challenge/">
              Start a challenge
            </a>
          </section>
        )}
      </main>
      <div className="ob-landscape-footer">
        <Footer product />
        <p className="ob-footer-disclosure">
          One Breath is not affiliated with Wispr. Practice points have no cash or credit value.
        </p>
      </div>
      {showRules && (
        <div className="ob-modal-backdrop" onClick={() => setShowRules(false)}>
          <section
            ref={rules}
            tabIndex={-1}
            className="ob-rules"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ob-rules-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="ob-modal-close"
              onClick={() => setShowRules(false)}
              aria-label="Close scoring rules"
            >
              <X size={19} />
            </button>
            <span className="ob-eyebrow">HOW TO PLAY</span>
            <h2 id="ob-rules-title">Make the message land.</h2>
            <p>
              Pick a mission, choose your input method and start a round. With Flow, click the
              response field and use your installed Flow shortcut. Stop dictating, review your text,
              then score your round. Replay to improve or share your score on the honor board.
            </p>
            <p>
              Team and interview missions award up to 75 points for three word-based signals, plus
              up to 25 for the word budget. Signals use keyword groups and can miss valid phrasing.
              They do not verify meaning, facts or interview quality.
            </p>
            <p>
              Read-back scores the share of words matched in order against the reference. Extra and
              missing words reduce the score. Case and punctuation are ignored.
            </p>
            <p>
              Speed, accent, pronunciation and filler words are not scored. Flow can remove fillers,
              so its finished text cannot reliably tell us how you spoke.
            </p>
            <button className="ob-primary" onClick={() => setShowRules(false)}>
              Got it. Let’s play.
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
