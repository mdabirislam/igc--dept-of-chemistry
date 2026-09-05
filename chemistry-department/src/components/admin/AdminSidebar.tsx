"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Users,
  FileText,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

const menu = [
  {
    label: "ড্যাশবোর্ড",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "নোটিশ",
    href: "/admin/notices",
    icon: Bell,
  },
  {
    label: "শিক্ষকবৃন্দ",
    href: "/admin/faculty",
    icon: Users,
  },
  {
    label: "রিসোর্স",
    href: "/admin/resources",
    icon: FileText,
  },
  {
    label: "ইভেন্ট",
    href: "/admin/events",
    icon: CalendarDays,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b bg-white lg:min-h-[calc(100vh-73px)] lg:w-64 lg:border-b-0 lg:border-r">      <div className="p-5">
        {/* <h2 className="text-lg font-bold text-[#1b5e20]">
          Chemistry Admin
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Ishwardi Government College
        </p> */}
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:overflow-visible lg:pb-4">
        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition lg:gap-3 ${
                active
                  ? "bg-green-50 font-semibold text-[#1b5e20]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />

              <span className="whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}

        <Link
          href="/"
          className="mt-0 flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 lg:mt-4 lg:gap-3"
        >
          <ExternalLink size={18} />

          <span className="whitespace-nowrap">
            ওয়েবসাইট দেখুন
          </span>
        </Link>
      </nav>
    </aside>
  );
}