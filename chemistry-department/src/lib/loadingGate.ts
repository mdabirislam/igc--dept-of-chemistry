// Tiny registry used by the first-load splash screen (SiteLoader).
//
// Components that must be ready before the page is shown (header logos,
// hero banner, department-head photo) register themselves as "pending"
// when they mount and mark themselves done once their image has loaded.
// Everything else (gallery, resources, ...) is NOT registered, so slow
// files there never keep the splash screen on.

export const SITE_READY_EVENT = "site-loader-done";

const pending = new Set<string>();

export function addPending(id: string) {
  pending.add(id);
}

export function donePending(id: string) {
  pending.delete(id);
}

export function pendingCount() {
  return pending.size;
}
