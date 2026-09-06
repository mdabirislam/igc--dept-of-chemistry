export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface LoginResponse {
  token: string;
  user: AdminUser;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000/api";

const TOKEN_KEY = "chemistry_admin_token";
const USER_KEY = "chemistry_admin_user";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value =
    localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AdminUser;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<AdminUser> {
  const response = await fetch(
    `${API_BASE_URL}/auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data =
    (await response.json()) as Partial<LoginResponse> & {
      detail?: string;
    };

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Username অথবা password সঠিক নয়।"
    );
  }

  if (!data.token || !data.user) {
    throw new Error(
      "Server থেকে valid login response পাওয়া যায়নি।"
    );
  }

  localStorage.setItem(
    TOKEN_KEY,
    data.token
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user)
  );

  return data.user;
}

export async function logoutAdmin(): Promise<void> {
  const token = getAdminToken();

  try {
    if (token) {
      await fetch(
        `${API_BASE_URL}/auth/logout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch {
    // Local logout still happens.
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    window.location.href =
      "/admin/login";
  }
}