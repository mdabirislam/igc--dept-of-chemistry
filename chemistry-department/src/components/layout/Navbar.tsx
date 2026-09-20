"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./navbar.css";

type NavigationItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
};

const navigationItems: NavigationItem[] = [
  {
    label: "বিভাগ সম্পর্কে",
    href: "/about",
    children: [
      { label: "বিভাগের পরিচিতি", href: "/about/overview" },
      { label: "ইতিহাস", href: "/about/history" },
      { label: "মিশন", href: "/about/mission" },
      { label: "ভিশন", href: "/about/vision" },
      { label: "সুবিধাসমূহ", href: "/about/facilities" },
    ],
  },
  {
    label: "পাঠ্যক্রম",
    href: "/academics",
    children: [
      { label: "রুটিন", href: "/academics/routine" },
      { label: "সিলেবাস", href: "/academics/syllabus" },
      { label: "কোর্সসমূহ", href: "/academics/courses" },
      { label: "পরীক্ষা", href: "/academics/examination" },
    ],
  },
  {
    label: "শিক্ষকবৃন্দ",
    href: "/faculty",
  },
  {
    label: "একাডেমিক",
    href: "/academics",
  },
  {
    label: "শিক্ষার্থী কর্নার",
    href: "/resources",
  },
  {
    label: "কার্যক্রম",
    href: "/activities",
  },
  {
    label: "গবেষণা ও প্রকাশনা",
    href: "/research",
    children: [
      { label: "গবেষণা", href: "/research" },
      { label: "Under Construction", href: "/research" },
    ],
  },
  {
    label: "ল্যাবরেটরি",
    href: "/laboratory",
    children: [
      { label: "Under Construction", href: "/laboratory" },
    ],
  },
  {
    label: "রিসোর্স",
    href: "/resources",
    children: [
      { label: "Under Construction", href: "/resources" },
    ],
  },
  {
    label: "নোটিশ",
    href: "/notices",
  },
  {
    label: "গ্যালারি",
    href: "/gallery",
    children: [
      { label: "ফটো", href: "/gallery/photo" },
      { label: "ভিডিও", href: "/gallery/video" },
      { label: "ওয়াল ম্যাগাজিন", href: "/gallery/wall-magazine" },
    ],
  },
  {
    label: "যোগাযোগ",
    href: "/contact",
    children: [
      { label: "Under Construction", href: "/contact" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setOpenSubmenu(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu((current) =>
      current === label ? null : label
    );
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-inner">

        <Link
          href="/"
          className="home-button"
          aria-label="হোম"
        >
          🏠
        </Link>

        {/* Desktop navigation */}
        <div className="desktop-navigation">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${
                item.children ? "has-submenu" : ""
              }`}
            >
              <Link
                href={item.href}
                className="nav-link"
              >
                <span>{item.label}</span>

                {item.children && (
                  <span className="dropdown-arrow">
                   ⌄
                  </span>
                )}
              </Link>

              {item.children && (
                <div className="desktop-submenu">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="submenu-link"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="navbar-search">
          <input
            type="search"
            placeholder="সাইটে খুঁজুন..."
            aria-label="সাইটে খুঁজুন"
          />

          <button
            type="button"
            aria-label="অনুসন্ধান"
          >
            🔍
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMobileOpen(true)}
          aria-label="মেনু খুলুন"
          aria-expanded={mobileOpen}
        >
          ☰
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile side menu */}
      <aside
        className={`mobile-navigation ${
          mobileOpen ? "mobile-navigation-open" : ""
        }`}
        aria-label="মোবাইল নেভিগেশন"
      >
        <div className="mobile-navigation-header">
          <div>
            <div className="mobile-menu-title">
              মেনু
            </div>
            <div className="mobile-menu-subtitle">
              Chemistry Department
            </div>
          </div>

          <button
            type="button"
            className="mobile-close-button"
            onClick={closeMobileMenu}
            aria-label="মেনু বন্ধ করুন"
          >
            ×
          </button>
        </div>

        <div className="mobile-navigation-content">
          <Link
            href="/"
            className="mobile-home-link"
            onClick={closeMobileMenu}
          >
            🏠
            <span>হোম</span>
          </Link>

          {navigationItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openSubmenu === item.label;

            if (!hasChildren) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className={`mobile-nav-group ${
                  isOpen ? "mobile-nav-group-open" : ""
                }`}
              >
                <div className="mobile-nav-parent">
                  <Link
                    href={item.href}
                    className="mobile-nav-parent-link"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>

                  <button
                    type="button"
                    className="mobile-submenu-toggle"
                    onClick={() =>
                      toggleSubmenu(item.label)
                    }
                    aria-label={`${item.label} submenu`}
                    aria-expanded={isOpen}
                  >
                    ›
                  </button>
                </div>

                <div className="mobile-submenu">
                  {item.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="mobile-submenu-link"
                      onClick={closeMobileMenu}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </nav>
  );
}