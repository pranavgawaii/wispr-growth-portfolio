import { TrackedYouTubePlayer } from './TrackedYouTubePlayer';
import { trackVideoEvent } from '../../lib/video-analytics';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface ThumbnailButtonProps {
  videoUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
}

export default function ThumbnailButton({
  videoUrl,
  youtubeId,
  thumbnailUrl,
  title = 'Play video',
  className = '',
}: ThumbnailButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileStarted = useRef(false);
  const reducedMotion = useReducedMotion();
  const thumbnail = thumbnailUrl || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      buttonRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        onClick={() => {
          fileStarted.current = false;
          trackVideoEvent('video_open', youtubeId || 'uploaded-video');
          setIsOpen(true);
        }}
        className={`video-thumbnail-button ${className}`}
        aria-label={title}
        aria-haspopup="dialog"
      >
        <span className="video-thumbnail-image">
          <img src={thumbnail} alt="" loading="lazy" width="80" height="48" />
          <span className="video-thumbnail-play">
            <Play size={12} fill="currentColor" aria-hidden="true" />
          </span>
        </span>
        <span className="video-thumbnail-label" aria-hidden="true">
          Watch the explanation
        </span>
      </motion.button>
      {isOpen &&
        createPortal(
          <dialog
            ref={dialogRef}
            className="video-preview-dialog"
            aria-label={title}
            onCancel={() => setIsOpen(false)}
            onClose={() => setIsOpen(false)}
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              className="video-preview-player"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <button
                type="button"
                className="video-preview-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close video"
                autoFocus
              >
                <X size={20} />
              </button>
              {youtubeId ? (
                <TrackedYouTubePlayer videoId={youtubeId} title={title} />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  onPlaying={() => {
                    if (fileStarted.current) return;
                    fileStarted.current = true;
                    trackVideoEvent('video_play', 'uploaded-video');
                  }}
                />
              )}
            </motion.div>
            {youtubeId && (
              <a
                className="video-preview-external"
                href={`https://youtu.be/${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on YouTube ↗
              </a>
            )}
          </dialog>,
          document.body,
        )}
    </>
  );
}
