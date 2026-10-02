"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/**
 * Single-line text. If it is too long for its box, it slowly scrolls
 * to the end, pauses, and scrolls back. Pauses on hover.
 * Short text stays still.
 */
export default function MarqueeText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    const inner = textRef.current;
    if (!box || !inner) return;

    const measure = () => {
      const overflow = inner.scrollWidth - box.clientWidth;
      setDistance(overflow > 4 ? Math.ceil(overflow) : 0);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(inner);

    return () => observer.disconnect();
  }, [text]);

  return (
    <span
      ref={boxRef}
      className={`marquee ${className}`}
      data-run={distance > 0}
      title={text}
      style={
        {
          "--marquee-dist": `${distance}px`,
          "--marquee-dur": `${(3 + distance / 30).toFixed(1)}s`,
        } as CSSProperties
      }
    >
      <span ref={textRef} className="marquee-inner">
        {text}
      </span>
    </span>
  );
}
