"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import type { SiteSettings } from "@/types/api";

// One request is shared by every component on the page
// (Footer, HeadMessage, Contact...). It is refreshed after
// 30 seconds so edits made in the admin panel show up soon.
const CACHE_MS = 30_000;

let cached: { promise: Promise<SiteSettings>; at: number } | null =
  null;

function loadSiteSettings() {
  if (!cached || Date.now() - cached.at > CACHE_MS) {
    const promise = apiFetch<SiteSettings>("/site-settings/");

    cached = { promise, at: Date.now() };

    promise.catch(() => {
      if (cached?.promise === promise) cached = null;
    });
  }

  return cached.promise;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // If the server is very slow, stop showing placeholders and let the
    // components use their built-in defaults.
    const timer = setTimeout(() => {
      if (active) setLoading(false);
    }, 5000);

    loadSiteSettings()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch(() => {
        // Components fall back to their built-in defaults.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  return { settings, loading };
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
