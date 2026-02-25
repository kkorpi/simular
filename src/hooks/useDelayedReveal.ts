import { useState, useEffect, useRef, type RefObject } from "react";

/**
 * Timer-based card reveal with optional auto-scroll.
 * Returns `visible` boolean that flips to true after `delayMs`
 * once `condition` is true. Scrolls the `scrollRef` container
 * to bottom 100ms after reveal.
 */
export function useDelayedReveal(
  condition: boolean,
  delayMs: number,
  scrollRef?: RefObject<HTMLDivElement | null>
): boolean {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!condition) {
      setVisible(false);
      return;
    }
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timerRef.current);
  }, [condition, delayMs]);

  // Auto-scroll on reveal
  useEffect(() => {
    if (!visible || !scrollRef?.current) return;
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [visible, scrollRef]);

  return visible;
}
