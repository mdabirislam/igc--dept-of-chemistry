/**
 * Public address of the website, used for canonical URLs, Open Graph, the
 * sitemap and robots.txt. Set NEXT_PUBLIC_SITE_URL in the hosting environment
 * (Vercel) to the real domain; the fallback is only a safe default.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://igc-dept-of-chemistry.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "রসায়ন বিভাগ | ঈশ্বরদী সরকারি কলেজ";

export const SITE_DESCRIPTION =
  "ঈশ্বরদী সরকারি কলেজের রসায়ন বিভাগের একাডেমিক ও তথ্যভিত্তিক ওয়েবসাইট।";
