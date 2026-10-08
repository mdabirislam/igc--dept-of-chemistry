import type { Metadata } from "next";

import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export const metadata: Metadata = {
  title: "অ্যাডমিন প্যানেল | রসায়ন বিভাগ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      {children}
    </AdminAuthGuard>
  );
}