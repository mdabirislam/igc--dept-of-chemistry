"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import {
  isAdminAuthenticated,
} from "@/lib/auth";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

function subscribeToAdminAuth(
  onStoreChange: () => void
) {
  window.addEventListener(
    "storage",
    onStoreChange
  );

  window.addEventListener(
    "admin-auth-change",
    onStoreChange
  );

  return () => {
    window.removeEventListener(
      "storage",
      onStoreChange
    );

    window.removeEventListener(
      "admin-auth-change",
      onStoreChange
    );
  };
}

function getAdminAuthSnapshot() {
  return isAdminAuthenticated();
}

function getServerAdminAuthSnapshot() {
  return false;
}

export default function AdminAuthGuard({
  children,
}: AdminAuthGuardProps) {
  const pathname = usePathname();

  const isAuthenticated = useSyncExternalStore(
    subscribeToAdminAuth,
    getAdminAuthSnapshot,
    getServerAdminAuthSnapshot
  );

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    if (!isAuthenticated) {
      window.location.replace("/admin/login");
    }
  }, [pathname, isAuthenticated]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
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