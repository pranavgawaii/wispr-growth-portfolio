import { useEffect } from 'react';

let audio: AudioContext | undefined;
let lastClick = 0;

async function playClick(theme: boolean) {
  try {
    const now = performance.now();
    if (now - lastClick < 70) return;
    lastClick = now;
    const Audio =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    audio ??= new Audio();
    if (audio.state === 'suspended') await audio.resume();
    const start = audio.currentTime;
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(theme ? 260 : 620, start);
    tone.frequency.exponentialRampToValueAtTime(theme ? 90 : 240, start + 0.035);
    volume.gain.setValueAtTime(0, start);
    volume.gain.linearRampToValueAtTime(0.025, start + 0.002);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.045);
    tone.connect(volume);
    volume.connect(audio.destination);
    tone.start(start);
    tone.stop(start + 0.05);
    tone.onended = () => {
      tone.disconnect();
      volume.disconnect();
    };
  } catch {
    // Audio is optional; interactions should always work without it.
  }
}

export function useClickSound() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest(
        'button,a[href],input[type="checkbox"],input[type="radio"],[role="button"],[role="tab"],[role="switch"]',
      );
      if (
        !control ||
        control.matches(':disabled,[aria-disabled="true"]') ||
        control.closest('[data-sound="off"]')
      )
        return;
      void playClick(control.classList.contains('eclipse-toggle'));
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, []);
}
