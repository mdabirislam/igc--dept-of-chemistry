"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBangla(value: string) {
  return value.replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)]);
}

type CountUpProps = {
  /** final number */
  to: number;
  /** pad with leading zeros, e.g. 2 -> ০৮ */
  pad?: number;
  /** append "+" (e.g. ৮০+) */
  plus?: boolean;
  /** animation length in ms */
  duration?: number;
};

/**
 * Counts from 0 up to `to` (in Bangla digits) once, when it scrolls
 * into view. Shows the final number straight away if the person
 * prefers reduced motion.
 */
export default function CountUp({
  to,
  pad = 0,
  plus = false,
  duration = 1200,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({
    threshold: 0.4,
  });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // With reduced motion the first frame jumps straight to the final number.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = reduceMotion
        ? 1
        : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      setCurrent(Math.round(to * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  const text = String(current).padStart(pad, "0");

  return (
    <span ref={ref}>
      {toBangla(text)}
      {plus && "+"}
    </span>
  );
}
