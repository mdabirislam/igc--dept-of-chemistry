"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./navbar.css";
import { ChevronDown } from "react-bootstrap-icons";
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
      // { label: "সুবিধাসমূহ", href: "/about/facilities" },
    ],
  },
  {
    label: "একাডেমিক",
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
    label: "শিক্ষার্থী কর্নার",
    href: "/resources",
  },
  {
    label: "কার্যক্রম",
    href: "/activities",
  },
  // {
  //   label: "গবেষণা ও প্রকাশনা",
  //   href: "/research",
  //   children: [
  //     { label: "গবেষণা", href: "/research" },
  //     { label: "Under Construction", href: "/research" },
  //   ],
  // },
  // {
  //   label: "ল্যাবরেটরি",
  //   href: "/laboratory",
  //   children: [
  //     { label: "Under Construction", href: "/laboratory" },
  //   ],
  // },
  {
    label: "রিসোর্স",
    href: "/resources",
    children: [
       { label: "ল্যাবরেটরি", href: "/laboratory" },
       { label: "লাইব্রেরি", href: "/library" },
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
              {item.children ? (
                <button
                  type="button"
                  className="nav-link nav-parent-button"
                  aria-haspopup="true"
                >
                  <span>{item.label}</span>
              
                  <ChevronDown
                    className="nav-chevron"
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="nav-link"
                >
                  <span>{item.label}</span>
                </Link>
              )}

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
                <button
                  type="button"
                  className="mobile-nav-parent"
                  onClick={() => toggleSubmenu(item.label)}
                  aria-expanded={isOpen}
                >
                  <span className="mobile-nav-parent-link">
                    {item.label}
                  </span>
                              
                  <span
                    className="mobile-submenu-toggle"
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} strokeWidth={1.8} />
                  </span>
                </button>

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