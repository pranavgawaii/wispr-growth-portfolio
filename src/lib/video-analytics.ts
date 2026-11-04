import { track } from '@vercel/analytics';

export function trackVideoEvent(event: 'video_open' | 'video_play', videoId: string) {
  if (!import.meta.env.PROD || import.meta.env.VITE_ANALYTICS_ENABLED !== 'true') return;
  try {
    track(event, { video_id: videoId, placement: 'hero' });
  } catch {
    // Analytics must never prevent the video from opening or playing.
  }
}
