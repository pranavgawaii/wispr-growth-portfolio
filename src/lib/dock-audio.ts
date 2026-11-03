let context: AudioContext | undefined;
let lastTick = 0;

export function unlockDockAudio() {
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume().catch(() => {});
  } catch {
    /* Sound is an optional enhancement. */
  }
}

export async function playDockTick(index: number) {
  // Retry after tab suspension or a browser audio interruption, rather than
  // relying on the first pointer-down event for the lifetime of the page.
  unlockDockAudio();
  if (!context) return;
  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }
  if (context.state !== 'running') return;
  const now = context.currentTime;
  if (now - lastTick < 0.055) return;
  lastTick = now;
  // A quiet, rounded glass note, with no sharp attack or long tail.
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(520 * Math.pow(2, (index % 5) / 12), now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.025, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.08);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}
