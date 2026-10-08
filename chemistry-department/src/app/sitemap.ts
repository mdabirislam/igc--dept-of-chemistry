import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Pages that have real content. Placeholder ("under construction") pages are
// left out on purpose: when a page gets its content, add its path here.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/notices", priority: 0.9 },
  { path: "/events", priority: 0.8 },
  { path: "/faculty", priority: 0.8 },
  { path: "/resources", priority: 0.7 },
  { path: "/gallery/photo", priority: 0.6 },
  { path: "/gallery/video", priority: 0.5 },
  { path: "/gallery/wall-magazine", priority: 0.5 },
  { path: "/contact", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    priority,
  }));
}
