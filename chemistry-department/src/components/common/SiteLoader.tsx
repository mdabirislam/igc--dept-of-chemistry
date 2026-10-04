"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { SITE_READY_EVENT, pendingCount } from "@/lib/loadingGate";

import "./site-loader.css";

const MIN_VISIBLE_MS = 600; // avoids a one-frame flash on fast loads
const MAX_WAIT_MS = 8000; // never block the site longer than this
const FADE_MS = 500;

type Phase = "show" | "hiding" | "gone";

/**
 * First-load splash screen for the public site.
 *
 * It waits only for the assets that registered through `useAssetGate`
 * (header logos, hero banner, department-head photo). Admin pages never
 * show it.
 */
export default function SiteLoader() {
  const pathname = usePathname();

  // Decided once: if the visit starts in the admin panel there is no splash.
  const [skip] = useState(() => pathname.startsWith("/admin"));

  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    if (skip) {
      // Let AOS start straight away (after it has attached its listener).
      const timer = setTimeout(() => {
        document.dispatchEvent(new Event(SITE_READY_EVENT));
      }, 0);

      return () => clearTimeout(timer);
    }

    const start = performance.now();
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;

      clearInterval(poll);
      clearTimeout(maxTimer);

      setPhase("hiding");

      // Page animations (AOS) begin while the splash fades out.
      document.dispatchEvent(new Event(SITE_READY_EVENT));

      hideTimer = setTimeout(() => setPhase("gone"), FADE_MS);
    }

    const poll = setInterval(() => {
      if (
        pendingCount() === 0 &&
        performance.now() - start >= MIN_VISIBLE_MS
      ) {
        finish();
      }
    }, 100);

    const maxTimer = setTimeout(finish, MAX_WAIT_MS);

    return () => {
      clearInterval(poll);
      clearTimeout(maxTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [skip]);

  // Keep the page from scrolling underneath the splash screen.
  useEffect(() => {
    if (skip || phase === "gone") return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [phase, skip]);

  if (skip || phase === "gone") return null;

  return (
    <div
      id="site-loader"
      className={`site-loader${
        phase === "hiding" ? " site-loader--hide" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="site-loader__content">
        <p className="site-loader__title">
          Department of Chemistry
        </p>

        <p className="site-loader__subtitle">
          Ishwardi Government College
        </p>

        <p className="site-loader__loading">
          Loading<span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    </div>
  );
}
