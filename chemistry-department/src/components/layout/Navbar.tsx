"use client";

import Link from "next/link";
import { useState } from "react";

const navigationItems = [
  {
    label: "বিভাগ সম্পর্কে",
    href: "/about",
  },
  {
    label: "পাঠ্যক্রম",
    href: "/academics",
    dropdown: true,
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
    label: "গবেষণা ও প্রকাশনা",
    href: "/research",
  },
  {
    label: "নোটিশ",
    href: "/notices",
  },
  {
    label: "যোগাযোগ",
    href: "/contact",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="main-navbar">
      <div className="navbar-inner">

        <Link href="/" className="home-button" aria-label="হোম">
          🏠
        </Link>

        <div className="desktop-navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link"
            >
              {item.label}
              {item.dropdown && <span className="dropdown-arrow">⌄</span>}
            </Link>
          ))}
        </div>

        <div className="navbar-search">
          <input
            type="search"
            placeholder="সাইটে খুঁজুন..."
            aria-label="সাইটে খুঁজুন"
          />
          <button type="button" aria-label="অনুসন্ধান">
            🔍
          </button>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="মেনু"
          aria-expanded={mobileOpen}
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}