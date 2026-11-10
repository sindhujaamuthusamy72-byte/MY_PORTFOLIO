import { useState, useEffect, useRef } from 'react';

/**
 * Tracks reduced-motion preference dynamically across OS/browser updates.
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setPrefersReducedMotion(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Consistent scroll-triggered visibility lifecycle:
 * - `hasEntered`: latches true once section enters the viewport (never resets on tiny nudges).
 * - `isNearViewport`: tracks wide-buffer visibility so offscreen videos pause cleanly to save resources.
 */
export function useViewportPresence(
  sectionRef,
  { threshold = 0.08, rootMargin = '0px 0px -6% 0px', offscreenMargin = '220px 0px 220px 0px' } = {}
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasEntered, setHasEntered] = useState(prefersReducedMotion);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const enteredRef = useRef(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      enteredRef.current = true;
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const enterObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (!enteredRef.current) {
            enteredRef.current = true;
            setHasEntered(true);
          }
          enterObserver.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setIsNearViewport(visible);
      },
      { threshold: 0, rootMargin: offscreenMargin }
    );

    enterObserver.observe(el);
    visibilityObserver.observe(el);

    return () => {
      enterObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [sectionRef, threshold, rootMargin, offscreenMargin]);

  return {
    hasEntered: hasEntered || prefersReducedMotion,
    isNearViewport,
    prefersReducedMotion,
  };
}

/**
 * Unified scroll-triggered video lifecycle helper:
 * - Waits until media is playable (`canplay` / `readyState >= 3`) before playing.
 * - Handles `loadedmetadata`, `canplay`, `playing`, `ended`, `error`, and rejected `play()`.
 * - Pauses when scrolled far outside viewport and resumes smoothly on return until `ended`.
 * - Preserves final resting frame cleanly when complete without looping or static substitution.
 */
export function useScrollVideoLifecycle({
  sectionRef,
  videoRef,
  threshold = 0.08,
  offscreenMargin = '220px 0px 220px 0px',
  reducedMotionSeekOffsetFromEnd = 0.12,
  onEndedComplete,
}) {
  const { hasEntered, isNearViewport, prefersReducedMotion } = useViewportPresence(sectionRef, {
    threshold,
    offscreenMargin,
  });

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(prefersReducedMotion);
  const [hasError, setHasError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const hasEndedRef = useRef(prefersReducedMotion);
  const isNearRef = useRef(false);
  const hasEnteredRef = useRef(hasEntered);
  const onEndedRef = useRef(onEndedComplete);

  useEffect(() => {
    onEndedRef.current = onEndedComplete;
  }, [onEndedComplete]);

  useEffect(() => {
    isNearRef.current = isNearViewport;
    hasEnteredRef.current = hasEntered;
  }, [isNearViewport, hasEntered]);

  // Set up native media events once on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlayWhenReady = () => {
      if (prefersReducedMotion || hasEndedRef.current) return;
      if (!hasEnteredRef.current || !isNearRef.current) return;
      if (video.readyState < 2) return;

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          setAutoplayBlocked(true);
        });
      }
    };

    const handleLoadedMetadata = () => {
      if (prefersReducedMotion && Number.isFinite(video.duration)) {
        video.currentTime = Math.max(0, video.duration - reducedMotionSeekOffsetFromEnd);
        video.pause();
        setIsVideoReady(true);
      }
    };

    const handleCanPlay = () => {
      setIsVideoReady(true);
      tryPlayWhenReady();
    };

    const handlePlaying = () => {
      setIsVideoReady(true);
      setIsPlaying(true);
      setAutoplayBlocked(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      hasEndedRef.current = true;
      setHasEnded(true);
      setIsPlaying(false);
      video.pause();
      if (onEndedRef.current) {
        onEndedRef.current(video);
      }
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    const initRaf = requestAnimationFrame(() => {
      if (video.readyState >= 1) {
        handleLoadedMetadata();
      }
      if (video.readyState >= 3) {
        handleCanPlay();
      }
    });

    return () => {
      cancelAnimationFrame(initRaf);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [videoRef, prefersReducedMotion, reducedMotionSeekOffsetFromEnd]);

  // Viewport enter / pause-offscreen / resume synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      hasEndedRef.current = true;
      if (!video.paused) video.pause();
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        video.currentTime = Math.max(0, video.duration - reducedMotionSeekOffsetFromEnd);
      }
      return;
    }

    if (hasEndedRef.current) return;

    if (hasEntered && isNearViewport) {
      if (video.readyState >= 2 && video.paused) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            setAutoplayBlocked(true);
          });
        }
      }
    } else if (!isNearViewport && !video.paused) {
      video.pause();
    }
  }, [videoRef, hasEntered, isNearViewport, prefersReducedMotion, reducedMotionSeekOffsetFromEnd]);

  return {
    hasEntered,
    isNearViewport,
    prefersReducedMotion,
    isVideoReady,
    isPlaying,
    hasEnded: hasEnded || prefersReducedMotion,
    hasError,
    autoplayBlocked,
  };
}
