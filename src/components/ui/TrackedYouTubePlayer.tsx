import { useEffect, useRef, useState } from 'react';
import { loadYouTubePlayer } from '../../lib/youtube-player';
import { trackVideoEvent } from '../../lib/video-analytics';

export function TrackedYouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let disposed = false;
    let started = false;
    let player: { destroy(): void } | undefined;
    void loadYouTubePlayer()
      .then((api) => {
        if (disposed || !host.current) return;
        const mount = document.createElement('div');
        host.current.append(mount);
        player = new api.Player(mount, {
          videoId,
          playerVars: { autoplay: 1, rel: 0, playsinline: 1, origin: window.location.origin },
          events: {
            onReady: (event) => {
              if (disposed) return;
              const frame = host.current?.querySelector('iframe');
              frame?.setAttribute('title', title);
              event.target.playVideo();
            },
            onStateChange: (event) => {
              // PLAYING (1) is actual playback; pausing/resuming must not inflate counts.
              if (disposed || started || event.data !== 1) return;
              started = true;
              trackVideoEvent('video_play', videoId);
            },
          },
        });
      })
      .catch(() => {
        if (!disposed) setFallback(true);
      });
    return () => {
      disposed = true;
      player?.destroy();
    };
  }, [videoId, title]);

  return fallback ? (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  ) : (
    <div ref={host} className="video-youtube-host" aria-label={title} />
  );
}
