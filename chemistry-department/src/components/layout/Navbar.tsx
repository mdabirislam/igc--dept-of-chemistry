"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown , HouseFill} from "react-bootstrap-icons";
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
  {
    label: "গবেষণা ও প্রকাশনা",
    href: "/research",
    children: [
      { label: "Not available", href: "#" },
    ],
  },
  {
    label: "রিসোর্স",
    href: "/resources",
    children: [
       { label: "ল্যাবরেটরি", href: "/resources/laboratory" },
       { label: "লাইব্রেরি", href: "/resources/library" },
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
      { label: "ওয়াল ম্যাগাজিন", href: "/gallery/wall-magazine" },
    ],
  },
  {
    label: "যোগাযোগ",
    href: "/contact",
  },
  //   {
  //   label: "অন্যান্য",
  //   href: "/other",
  //   children: [
  //     { label: "Not available", href: "#" },
  //   ],
  // },
];

/* ---------- Active link helpers ---------- */

const isPathActive = (pathname: string, href: string) =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(href + "/");

const isItemActive = (pathname: string, item: NavigationItem) =>
  isPathActive(pathname, item.href) ||
  (item.children?.some((child) => isPathActive(pathname, child.href)) ??
    false);

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

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

  // Smart sticky navbar: hide on scroll down, show on scroll up
  useEffect(() => {
    const SHOW_ALWAYS_BELOW = 120; // px from top: navbar always visible
    const THRESHOLD = 8; // ignore tiny scroll movements

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY;

      if (currentY <= SHOW_ALWAYS_BELOW) {
        setHidden(false);
        lastY = currentY;
      } else if (Math.abs(diff) >= THRESHOLD) {
        setHidden(diff > 0); // down => hide, up => show
        lastY = currentY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <nav
      className={`main-navbar ${
        hidden && !mobileOpen ? "main-navbar-hidden" : ""
      }`}
    >
      <div className="navbar-inner">

        <Link
          href="/"
          className={`home-button ${
            pathname === "/" ? "home-button-active" : ""
          }`}
          aria-label="হোম"
        >
          <HouseFill size={22} style={{ color: '#fff'}} />
        </Link>

        {/* Desktop navigation */}
        <div className="desktop-navigation">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${
                item.children ? "has-submenu" : ""
              } ${isItemActive(pathname, item) ? "nav-item-active" : ""}`}
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
                  aria-current={
                    isItemActive(pathname, item) ? "page" : undefined
                  }
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
                      className={`submenu-link ${
                        isPathActive(pathname, child.href)
                          ? "submenu-link-active"
                          : ""
                      }`}
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
            className={`mobile-home-link ${
              pathname === "/" ? "mobile-nav-link-active" : ""
            }`}
            onClick={closeMobileMenu}
          >
            🏠
            <span>হোম</span>
          </Link>

          {navigationItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openSubmenu === item.label;
            const active = isItemActive(pathname, item);

            if (!hasChildren) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`mobile-nav-link ${
                    active ? "mobile-nav-link-active" : ""
                  }`}
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
                  <span
                    className={`mobile-nav-parent-link ${
                      active ? "mobile-nav-link-active" : ""
                    }`}
                  >
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
                      className={`mobile-submenu-link ${
                        isPathActive(pathname, child.href)
                          ? "mobile-nav-link-active"
                          : ""
                      }`}
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
