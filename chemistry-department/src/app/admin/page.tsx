"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  CalendarDays,
  FileText,
  RefreshCw,
  Users,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import type {
  ApiEvent,
  ApiFaculty,
  ApiNotice,
  ApiResource,
} from "@/types/api";

export default function AdminPage() {
  const [counts, setCounts] =
    useState({
      notices: 0,
      faculty: 0,
      resources: 0,
      events: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        notices,
        faculty,
        resources,
        events,
      ] = await Promise.all([
        apiFetch<ApiNotice[]>(
          "/notices/"
        ),
        apiFetch<ApiFaculty[]>(
          "/faculty/"
        ),
        apiFetch<ApiResource[]>(
          "/resources/"
        ),
        apiFetch<ApiEvent[]>(
          "/events/"
        ),
      ]);

      setCounts({
        notices: notices.length,
        faculty: faculty.length,
        resources: resources.length,
        events: events.length,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Dashboard data লোড করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

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
          onClick={() => {
            void loadDashboard();
          }}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="নোটিশ"
          value={counts.notices}
          icon={<Bell size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="শিক্ষকবৃন্দ"
          value={counts.faculty}
          icon={<Users size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="রিসোর্স"
          value={counts.resources}
          icon={<FileText size={20} />}
          loading={loading}
        />

        <DashboardCard
          title="ইভেন্ট"
          value={counts.events}
          icon={<CalendarDays size={20} />}
          loading={loading}
        />
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Chemistry Department
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          বিভাগীয় নোটিশ, শিক্ষকবৃন্দ,
          একাডেমিক রিসোর্স এবং ইভেন্ট
          পরিচালনার জন্য Admin Dashboard।
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <div className="rounded-lg bg-green-50 p-2 text-[#1b5e20]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-bold text-[#1b5e20]">
        {loading ? "—" : value}
      </p>
    </div>
  );
}