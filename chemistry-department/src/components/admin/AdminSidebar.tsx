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
  GalleryHorizontal,
  ImagePlus,
  Settings,
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
  {
    label: "হিরো ব্যানার",
    href: "/admin/banners",
    icon: ImagePlus,
  },
  {
    label: "গ্যালারি",
    href: "/admin/gallery",
    icon: GalleryHorizontal,
  },
  {
    label: "সাইট সেটিংস",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[73px] z-20 w-full shrink-0 border-b bg-white lg:h-[calc(100vh-73px)] lg:w-64 lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="hidden h-3 lg:block" />

      <nav className="flex gap-1 overflow-x-auto px-3 py-2 lg:block lg:overflow-visible lg:pb-4 lg:pt-0">
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