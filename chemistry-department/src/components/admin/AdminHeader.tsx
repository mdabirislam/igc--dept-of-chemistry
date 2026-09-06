"use client";

import {
  LogOut,
  UserCircle,
} from "lucide-react";

import {
  getAdminUser,
  logoutAdmin,
} from "@/lib/auth";

export default function AdminHeader() {
  const user = getAdminUser();

  return (
    <header className="flex items-center justify-between border-b bg-white px-5 py-4">
      <div>
        <h1 className="font-semibold text-gray-800">
          Administration
        </h1>

        <p className="text-xs text-gray-500">
          Chemistry Department
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <UserCircle
            size={18}
            className="text-gray-400"
          />

          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {user?.name ||
                user?.username ||
                "Admin"}
            </p>

            <p className="text-[11px] text-gray-400">
              Administrator
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            void logoutAdmin();
          }}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}