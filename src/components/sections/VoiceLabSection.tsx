import { PortfolioRibbon } from '../ui/PortfolioRibbon';
import React, { useState, useEffect, useRef } from 'react';
import { VOICE_CLIPS } from '../../data/voiceClips';
import { Mic, MicOff, Play, Square, Volume2, VolumeX, Headphones } from 'lucide-react';

function getSpeechRecognition(): SpeechRecognition | null {
  const Constructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  return Constructor ? new Constructor() : null;
}

export const VoiceLabSection: React.FC = () => {
  const [trial, setTrial] = useState<'mic' | 'flow'>('flow');
  const flowInputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (trial === 'flow') flowInputRef.current?.focus({ preventScroll: true });
  }, [trial]);
  const [flowDraft, setFlowDraft] = useState('');
  const officialScript = 'let’s meet at 5... actually 6pm';
  const [mode, setMode] = useState<'examples' | 'live'>('examples');
  const [activeClipIdx, setActiveClipIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [, setIsRevealing] = useState(false);
  const [, setPlaybackProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [clipStatus, setClipStatus] = useState<string>('');

  // Real voice input state
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [hasMicSupport, setHasMicSupport] = useState(false);
  const [micError, setMicError] = useState('');

  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const sectionRef = useRef<HTMLElement>(null);
  const currentClip = VOICE_CLIPS[activeClipIdx];

  useEffect(() => {
    setHasMicSupport(
      typeof window !== 'undefined' &&
        (!!window.SpeechRecognition || !!window.webkitSpeechRecognition),
    );
  }, []);

  const stopClip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current = null;
    }
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    if (outTimeoutRef.current) clearTimeout(outTimeoutRef.current);
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    setIsPlaying(false);
    setIsRevealing(false);
  };

  useEffect(() => {
    stopClip();
    setSpokenText('');
    setConvertedText('');
    setClipStatus('');
    setPlaybackProgress(0);
    return () => stopClip();
  }, [activeClipIdx]);

  const typeWriter = (fullText: string, onDone: () => void, target: 'raw' | 'out') => {
    clearInterval(typeIntervalRef.current!);
    let index = 0;
    typeIntervalRef.current = setInterval(() => {
      index++;
      if (target === 'raw') {
        setSpokenText(fullText.slice(0, index));
      } else {
        setConvertedText(fullText.slice(0, index));
      }
      if (index >= fullText.length) {
        clearInterval(typeIntervalRef.current!);
        typeIntervalRef.current = null;
        onDone();
      }
    }, 18);
  };

  const playClip = () => {
    stopClip();
    if (currentClip.audio) {
      const audio = new Audio(currentClip.audio);
      audioRef.current = audio;
      audio.muted = !soundEnabled;
      audio.preload = 'metadata';
      setSpokenText('');
      setConvertedText('');
      setPlaybackProgress(0);
      setIsPlaying(true);
      setClipStatus('Playing the recorded example.');
      audio.ontimeupdate = () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setPlaybackProgress(audio.currentTime / audio.duration);
          setSpokenText(
            currentClip.raw.slice(
              0,
              Math.ceil((currentClip.raw.length * audio.currentTime) / audio.duration),
            ),
          );
        }
      };
      audio.onended = () => {
        setSpokenText(currentClip.raw);
        setPlaybackProgress(1);
        setIsRevealing(true);
        setClipStatus('Revealing the written version.');
        const complete = () => {
          setIsRevealing(false);
          setIsPlaying(false);
          setClipStatus('Example complete.');
        };
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setConvertedText(currentClip.out);
          complete();
        } else typeWriter(currentClip.out, complete, 'out');
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setClipStatus('Audio could not load. Please try again.');
      };
      void audio.play().catch(() => {
        setIsPlaying(false);
        setClipStatus('Playback could not start. Press play to try again.');
      });
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSpokenText(currentClip.raw);
      setConvertedText(currentClip.out);
      setClipStatus('Example ready.');
      return;
    }
    setIsPlaying(true);
    setSpokenText('');
    setConvertedText('');
    setClipStatus('Playing the example...');

    playTimeoutRef.current = setTimeout(() => {
      typeWriter(
        currentClip.raw,
        () => {
          outTimeoutRef.current = setTimeout(() => {
            typeWriter(
              currentClip.out,
              () => {
                setIsPlaying(false);
                setClipStatus('Example ready.');
              },
              'out',
            );
          }, 250);
        },
        'raw',
      );
    }, 1200);
  };

  // Real voice input handlers
  const startListening = () => {
    setMicError('');
    setLiveTranscript('');

    const recognition = getSpeechRecognition();
    if (!recognition) {
      setMicError('Speech recognition not supported in this browser.');
      return;
    }

    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const interim = Array.from({ length: e.results.length }, (_, i) => e.results[i])
        .map((r) => r[0].transcript)
        .join('');
      setLiveTranscript(interim);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (e.error === 'not-allowed') {
        setMicError('Microphone access was denied. Please allow it in your browser settings.');
      } else if (e.error === 'no-speech') {
        setMicError('No speech detected. Try speaking closer to the mic.');
      } else {
        setMicError(`Recognition error: ${e.error}`);
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setMicError('Could not start the microphone. Check browser permissions.');
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const method = mode === 'examples' ? 'examples' : trial;
  function chooseMethod(next: 'flow' | 'mic' | 'examples') {
    stopClip();
    stopListening();
    if (next === 'examples') setMode('examples');
    else {
      setMode('live');
      setTrial(next);
    }
  }
  return (
    <section
      ref={sectionRef}
      id="voice-lab"
      aria-labelledby="voice-lab-heading"
      className="voice-lab-unified compact-voice-lab max-w-[850px] mx-auto px-6 sm:px-8 pt-10 sm:pt-12 md:pt-14"
    >
      <header className="voice-lab-intro">
        <h2 id="voice-lab-heading">
          The voice lab <span className="voice-fun-label">(a fun element)</span>
        </h2>
        <p>A fun, 15-second detour. Hear me think out loud, then take the mic.</p>
      </header>
      <div className={`voice-workspace ${isListening || isPlaying ? 'voice-is-active' : ''}`}>
        <PortfolioRibbon />
        <div className="voice-methods" role="group" aria-label="Voice lab method">
          <button aria-pressed={method === 'examples'} onClick={() => chooseMethod('examples')}>
            <Headphones size={17} aria-hidden="true" />
            <span>Hear voice</span>
          </button>
          <button aria-pressed={method === 'flow'} onClick={() => chooseMethod('flow')}>
            <img src="/images/wispr-flow-mark.webp" alt="" className="voice-wispr-mark" />
            <span>Try with Wispr</span>
          </button>
          <button aria-pressed={method === 'mic'} onClick={() => chooseMethod('mic')}>
            <Mic size={17} aria-hidden="true" />
            <span>Use my mic</span>
          </button>
        </div>
        <div className="voice-workspace-toolbar">
          {method === 'examples' ? (
            <>
              <div className="voice-example-picks" role="group" aria-label="Recorded example">
                {VOICE_CLIPS.map((clip, index) => (
                  <button
                    key={clip.id}
                    aria-pressed={index === activeClipIdx}
                    onClick={() => setActiveClipIdx(index)}
                  >
                    {clip.n}
                  </button>
                ))}
              </div>
              <button
                className="voice-workspace-control"
                aria-label={isPlaying ? 'Stop example' : 'Play example'}
                onClick={() => {
                  if (isPlaying) stopClip();
                  else playClip();
                }}
              >
                {isPlaying ? <Square size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Stop' : 'Listen'}</span>
              </button>
            </>
          ) : method === 'mic' ? (
            <>
              <span>{isListening ? 'Listening. Speak naturally.' : 'Tap the mic to begin.'}</span>
              <button
                className={`voice-workspace-control ${isListening ? 'is-active' : ''}`}
                disabled={!hasMicSupport}
                aria-label={isListening ? 'Stop recording' : 'Start recording your voice'}
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isListening ? 'Stop' : 'Start mic'}</span>
              </button>
            </>
          ) : (
            <>
              <span>Click the field. Activate Flow. Read the script.</span>
              <button
                className="voice-workspace-control"
                onClick={() => flowInputRef.current?.focus({ preventScroll: true })}
              >
                Focus the field
              </button>
            </>
          )}
        </div>
        <div className="voice-pair">
          <div className="voice-source">
            <span className="voice-panel-label">
              {method === 'mic'
                ? 'YOUR WORDS'
                : method === 'examples'
                  ? 'WHAT I SAY'
                  : 'READ THIS ROUGH SCRIPT'}
            </span>
            <p>
              {method === 'mic' ? (
                liveTranscript.slice(-140) ||
                'A short thought is enough. Tell me what you’re working on.'
              ) : method === 'examples' ? (
                spokenText || currentClip.raw
              ) : (
                <span className="voice-script-reveal">{officialScript}</span>
              )}
            </p>
            <span className="voice-panel-foot">
              {method === 'flow' ? (
                <a href="https://wisprflow.ai/" target="_blank" rel="noreferrer">
                  Exact correction example from Wispr’s website.
                </a>
              ) : method === 'examples' ? (
                currentClip.hook
              ) : (
                'Browser speech recognition. Latest 140 characters.'
              )}
            </span>
          </div>
          <div className="voice-destination">
            <label
              className="voice-panel-label"
              htmlFor={method === 'flow' ? 'lab-flow-input' : undefined}
            >
              {method === 'flow'
                ? 'YOUR FLOW RESULT'
                : method === 'examples'
                  ? 'THE PREPARED DRAFT'
                  : 'YOUR TRANSCRIPT'}
            </label>
            {method === 'flow' ? (
              <textarea
                ref={flowInputRef}
                id="lab-flow-input"
                maxLength={400}
                value={flowDraft}
                onChange={(event) => setFlowDraft(event.target.value)}
                placeholder="Your Flow result lands here. Click, activate your shortcut, and speak."
              />
            ) : (
              <p>
                {method === 'examples'
                  ? convertedText ||
                    'Press Listen to hear the recording and reveal its prepared draft.'
                  : liveTranscript.slice(-140) || 'Your words appear here when you speak.'}
              </p>
            )}
            <span className="voice-panel-foot">
              {method === 'flow'
                ? flowDraft
                  ? 'Review what Flow kept and changed.'
                  : 'Uses your installed Flow app. You can also type.'
                : method === 'examples'
                  ? 'Recorded audio with prepared text.'
                  : 'No AI rewriting is applied.'}
            </span>
          </div>
        </div>
        <div className="voice-workspace-footer">
          <span role="status">
            {method === 'flow'
              ? 'This page doesn’t run Flow. Its output comes from your installed app.'
              : method === 'examples'
                ? clipStatus || 'My recordings. Prepared written examples, separate from Flow.'
                : micError ||
                  (!hasMicSupport
                    ? 'Browser dictation is unavailable. Try your installed Flow app.'
                    : 'Audio may be processed by your browser’s provider.')}
          </span>
          {method === 'flow' ? (
            <a href="https://wisprflow.ai/" target="_blank" rel="noreferrer">
              Get Flow
            </a>
          ) : method === 'examples' ? (
            <button
              aria-label={soundEnabled ? 'Mute recording' : 'Unmute recording'}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (audioRef.current) audioRef.current.muted = soundEnabled;
              }}
            >
              {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};
