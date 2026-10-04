"use client";

import { useCallback, useState } from "react";

interface FadeImageProps {
  src: string;
  alt: string;
  /** Classes for the wrapper (size, rounding...). */
  className?: string;
  /** Classes for the <img> itself. */
  imgClassName?: string;
  /** Shown when the image fails to load. */
  fallback?: React.ReactNode;
  loading?: "lazy" | "eager";
}

type State = "loading" | "loaded" | "error";

/**
 * Image with a shimmering placeholder while it loads, a soft fade-in
 * when it is ready, and a fallback if it cannot be loaded.
 */
export default function FadeImage({
  src,
  alt,
  className = "",
  imgClassName = "object-cover",
  fallback = null,
  loading = "lazy",
}: FadeImageProps) {
  const [state, setState] = useState<State>("loading");

  // "absolute" callers position the wrapper themselves.
  const positionClass = className.includes("absolute")
    ? ""
    : "relative";

  // The image may already be finished when React attaches (cache).
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) {
      setState(node.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  if (state === "error" && fallback) {
    return <div className={`${positionClass} ${className}`}>{fallback}</div>;
  }

  return (
    <div className={`${positionClass} overflow-hidden ${className}`}>
      {state === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-slate-200/80" />
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        className={`h-full w-full transition-opacity duration-500 ${imgClassName} ${
          state === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
