"use client";

import {
  FormEvent,
  useState,
} from "react";

import { LogIn, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  isAdminAuthenticated,
  loginAdmin,
} from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Username লিখুন।");
      return;
    }

    if (!password) {
      setError("Password লিখুন।");
      return;
    }

    setLoading(true);

    loginAdmin(
      username.trim(),
      password
    )
      .then(() => {
        router.replace("/admin");
        router.refresh();
      })
      .catch((error) => {
        setError(
          error instanceof Error
            ? error.message
            : "Login করা যায়নি।"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (
    typeof window !== "undefined" &&
    isAdminAuthenticated()
  ) {
    router.replace("/admin");
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-[#1b5e20]">
            <ShieldCheck size={30} />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            Admin Login
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Chemistry Department
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Ishwardi Government College
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoComplete="username"
                placeholder="Admin username"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                placeholder="Admin password"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#145218] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={17} />

              {loading
                ? "Login হচ্ছে..."
                : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Authorized administration only
        </p>
      </div>
    </main>
  );
}