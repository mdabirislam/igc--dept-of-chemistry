import type { Resource } from "@/types/api";

/** True when the resource points to an external website instead of a file. */
export function isLinkResource(resource: Resource): boolean {
  return resource.resource_type === "link";
}

/**
 * The address a visitor should open for this resource: the external URL for a
 * link resource, otherwise the uploaded file's URL. Null when nothing is
 * attached yet.
 */
export function getResourceHref(resource: Resource): string | null {
  if (isLinkResource(resource)) {
    return resource.url || null;
  }

  return resource.file_url;
}

/** Host name of a link (e.g. "example.com") for showing next to the title. */
export function getLinkHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
