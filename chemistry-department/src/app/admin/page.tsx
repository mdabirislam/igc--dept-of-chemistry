"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Bell,
  CalendarDays,
  FileText,
  GalleryHorizontal,
  ImagePlus,
  RefreshCw,
  Users,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

interface Counts {
  notices: number;
  faculty: number;
  resources: number;
  events: number;
  banners: number;
  gallery: number;
}

const emptyCounts: Counts = {
  notices: 0,
  faculty: 0,
  resources: 0,
  events: 0,
  banners: 0,
  gallery: 0,
};

async function countOf(endpoint: string) {
  const items = await apiFetch<unknown[]>(endpoint);

  return items.length;
}

async function fetchCounts(): Promise<Counts> {
  const [
    notices,
    faculty,
    resources,
    events,
    banners,
    gallery,
  ] = await Promise.all([
    countOf("/notices/"),
    countOf("/faculty/"),
    countOf("/resources/"),
    countOf("/events/"),
    countOf("/banners/"),
    countOf("/gallery/"),
  ]);

  return {
    notices,
    faculty,
    resources,
    events,
    banners,
    gallery,
  };
}

function errorText(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Dashboard data লোড করা যায়নি।";
}

export default function AdminPage() {
  const [counts, setCounts] = useState<Counts>(emptyCounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    return fetchCounts()
      .then((data) => {
        setCounts(data);
        setError("");
      })
      .catch((error: unknown) => {
        setError(errorText(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function refresh() {
    setLoading(true);
    void load();
  }

  return (
    <div className="space-y-6 p-5 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            ড্যাশবোর্ড
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Chemistry Department Content Management
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="নোটিশ"
          value={counts.notices}
          href="/admin/notices"
          icon={<Bell size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="শিক্ষকবৃন্দ"
          value={counts.faculty}
          href="/admin/faculty"
          icon={<Users size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="রিসোর্স"
          value={counts.resources}
          href="/admin/resources"
          icon={<FileText size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="ইভেন্ট"
          value={counts.events}
          href="/admin/events"
          icon={<CalendarDays size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="হিরো ব্যানার"
          value={counts.banners}
          href="/admin/banners"
          icon={<ImagePlus size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="গ্যালারি আইটেম"
          value={counts.gallery}
          href="/admin/gallery"
          icon={<GalleryHorizontal size={20} />}
          loading={loading}
        />
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Chemistry Department
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          বিভাগীয় নোটিশ, শিক্ষকবৃন্দ, একাডেমিক রিসোর্স, ইভেন্ট,
          ব্যানার ও গ্যালারি পরিচালনার জন্য Admin Dashboard।
          বিভাগীয় প্রধানের তথ্য ও যোগাযোগের তথ্য
          &quot;সাইট সেটিংস&quot; থেকে পরিবর্তন করুন।
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  href,
  icon,
  loading,
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        <div className="rounded-lg bg-green-50 p-2 text-[#1b5e20]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-bold text-[#1b5e20]">
        {loading ? "—" : value}
      </p>
    </Link>
  );
}
