"use client";

import {
  useEffect,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import {
  isAdminAuthenticated,
} from "@/lib/auth";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({
  children,
}: AdminAuthGuardProps) {
  const pathname = usePathname();

  const [checked, setChecked] =
    useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }

    if (!isAdminAuthenticated()) {
      window.location.replace(
        "/admin/login"
      );
      return;
    }

    setChecked(true);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">
          Admin session যাচাই হচ্ছে...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="lg:flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}