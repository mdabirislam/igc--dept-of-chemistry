import { getAdminToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000/api";

function buildUrl(endpoint: string) {
  if (
    endpoint.startsWith("http://") ||
    endpoint.startsWith("https://")
  ) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${API_BASE_URL}${normalizedEndpoint}`;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildUrl(endpoint);

  const headers = new Headers(
    options.headers
  );

  const token = getAdminToken();

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (
    !isFormData &&
    options.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Token ${token}`
    );
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message =
      `API request failed: ${response.status}`;

    try {
      const errorData =
        await response.json();

      if (
        typeof errorData === "object" &&
        errorData !== null
      ) {
        message = Object.entries(
          errorData
        )
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(", ")}`;
            }

            return `${key}: ${String(value)}`;
          })
          .join(" | ");
      }
    } catch {
      // Keep default message.
    }

    if (response.status === 401) {
      message =
        "আপনার admin session শেষ হয়েছে। আবার login করুন।";
    }

    if (response.status === 403) {
      message =
        "এই কাজটি করার অনুমতি আপনার নেই।";
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiPost<T>(
  endpoint: string,
  body: BodyInit
) {
  return apiFetch<T>(endpoint, {
    method: "POST",
    body,
  });
}

export function apiPut<T>(
  endpoint: string,
  body: BodyInit
) {
  return apiFetch<T>(endpoint, {
    method: "PUT",
    body,
  });
}

export function apiDelete<T = void>(
  endpoint: string
) {
  return apiFetch<T>(endpoint, {
    method: "DELETE",
  });
}