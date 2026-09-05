export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("chemistry_admin_auth") === "true";
}

export function loginAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("chemistry_admin_auth", "true");
  }
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("chemistry_admin_auth");

    window.location.href = "/admin";
  }
}