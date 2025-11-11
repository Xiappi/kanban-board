import { useEffect, useRef, useState } from "react";

/**
 * showAfter: delay before first showing (avoid flash on fast loads)
 * minVisible: minimum time spinner remains visible once shown
 * fadeMs: should match your CSS transition duration
 */
export function useSpinnerGate(
  isLoading: boolean,
  { showAfter = 200, minVisible = 400, fadeMs = 200 } = {}
) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const shownAt = useRef<number | null>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const unmountTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      [showTimer, hideTimer, unmountTimer].forEach((t) => {
        if (t.current) window.clearTimeout(t.current);
      });
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      if (showTimer.current) window.clearTimeout(showTimer.current);
      showTimer.current = window.setTimeout(() => {
        setMounted(true);
        requestAnimationFrame(() => {
          shownAt.current = Date.now();
          setVisible(true);
        });
      }, showAfter);
    } else {
      const elapsed = shownAt.current ? Date.now() - shownAt.current : 0;
      const remaining = Math.max(0, minVisible - elapsed);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        setVisible(false);
        if (unmountTimer.current) window.clearTimeout(unmountTimer.current);
        unmountTimer.current = window.setTimeout(() => {
          setMounted(false);
          shownAt.current = null;
        }, fadeMs);
      }, remaining);
    }
  }, [isLoading, showAfter, minVisible, fadeMs]);

  return { mounted, visible };
}
