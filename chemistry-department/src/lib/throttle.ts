/**
 * Bangla message for an HTTP 429 (too many requests) response from the API.
 *
 * The wait time comes from the Retry-After header. Browsers only expose that
 * header on cross-origin requests when the server lists it in
 * Access-Control-Expose-Headers, so we fall back to the number in DRF's
 * message ("Expected available in 42 seconds.").
 */
export function getThrottleMessage(
  retryAfterHeader: string | null,
  detail?: unknown
): string {
  let seconds = Number.parseInt(retryAfterHeader ?? "", 10);

  if (!Number.isFinite(seconds) && typeof detail === "string") {
    const match = detail.match(/(\d+)\s+second/i);

    if (match) {
      seconds = Number.parseInt(match[1], 10);
    }
  }

  const base = "অনেকবার চেষ্টা করা হয়েছে।";

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return `${base} কিছুক্ষণ পরে আবার চেষ্টা করুন।`;
  }

  const format = (value: number) => value.toLocaleString("bn-BD");

  if (seconds < 60) {
    return `${base} ${format(seconds)} সেকেন্ড পরে আবার চেষ্টা করুন।`;
  }

  return `${base} ${format(Math.ceil(seconds / 60))} মিনিট পরে আবার চেষ্টা করুন।`;
}
