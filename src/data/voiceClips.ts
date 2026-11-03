import type { VoiceClip } from '../types/voice';

export const VOICE_CLIPS: VoiceClip[] = [
  {
    id: 'developers',
    audio: '/audio/voice-lab/developers.mp3',
    n: 'Developers',
    hook: 'Your bug report is missing half the story.',
    raw: 'so the export button works but the csv has the wrong date format um it shows month first I think it’s the locale check the formatter',
    out: 'The export button works, but the CSV shows dates month-first. I think it’s a locale issue. Check the date formatter.',
    cta: 'Try dictating your next bug report.',
  },
  {
    id: 'students',
    audio: '/audio/voice-lab/students.mp3',
    n: 'Students',
    hook: 'Explain it out loud. Keep the clean notes.',
    raw: 'okay so photosynthesis is basically plants making food from light, no wait, from light water and carbon dioxide, and oxygen comes out',
    out: 'Photosynthesis: plants make food from light, water and carbon dioxide, and release oxygen.',
    cta: 'Try it on tonight’s lecture.',
  },
  {
    id: 'hinglish',
    audio: '/audio/voice-lab/hinglish.mp3',
    n: 'Hinglish',
    hook: 'Type in two languages? Just talk.',
    raw: 'bhai kal ki meeting 4 baje, no sorry 5 baje rakhte hain, I will share the doc before that',
    out: 'Bhai, kal ki meeting 5 baje rakhte hain. I’ll share the doc before that.',
    cta: 'Send your next message by voice.',
  },
];
