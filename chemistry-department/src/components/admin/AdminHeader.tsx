"use client";

import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/auth";

export default function AdminHeader() {
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

      <button
        onClick={logoutAdmin}
        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}