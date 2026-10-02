"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type Direction = "up" | "left" | "right" | "top" | "zoom" | "fade";

type RevealProps = {
  children: ReactNode;
  direction?: Direction;
  /** extra delay in ms */
  delay?: number;
  className?: string;
};

/**
 * Wraps content and animates it in when it scrolls into view.
 * Any `.enter` children inside also start once this wrapper is visible
 * (use style={{ "--i": n }} on them to stagger).
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-inview={inView}
      className={`enter enter-${direction} ${className}`}
      style={{ "--enter-base": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
