 "use client";

import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, ChevronLeft, Download, FileText } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Notice } from "@/types/api";

const categoryLabels: Record<string, string> = {
  academic: "একাডেমিক",
  exam: "পরীক্ষা",
  admission: "ভর্তি",
  general: "সাধারণ",
  event: "ইভেন্ট",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await apiFetch<Notice[]>("/notices/");
        setNotices(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "নোটিশ লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  const filteredNotices = useMemo(
    () =>
      category === "all"
        ? notices
        : notices.filter((notice) => notice.category === category),
    [category, notices]
  );

  return (
    <PublicSiteLayout>
      <main className="min-h-screen bg-[#f7f9fb]">
      <section className="bg-[#1a3a5c] text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1 text-sm text-white/75 hover:text-white"
          >
            <ChevronLeft size={16} />
            হোমে ফিরে যান
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">নোটিশ বোর্ড</h1>
              <p className="mt-1 text-sm text-white/75">
                রসায়ন বিভাগের সর্বশেষ বিজ্ঞপ্তি ও গুরুত্বপূর্ণ ঘোষণা
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-7 lg:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            {loading ? "নোটিশ লোড হচ্ছে..." : `${filteredNotices.length} টি নোটিশ`}
          </p>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#1b5e20]"
            aria-label="নোটিশের ক্যাটাগরি"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            নোটিশ লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            এই ক্যাটাগরিতে কোনো নোটিশ পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="divide-y">
              {filteredNotices.map((notice) => (
                <article
                  key={notice.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-800">
                        {notice.title}
                      </h2>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-[#1b5e20]">
                        {categoryLabels[notice.category] ?? notice.category}
                      </span>
                    </div>

                    {notice.details && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {notice.details}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      প্রকাশিত: {formatDate(notice.created_at)}
                    </p>
                  </div>

                  {notice.pdf_url && (
                    <a
                      href={notice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-[#1b5e20] hover:text-[#1b5e20]"
                    >
                      <Download size={16} />
                      PDF দেখুন
                    </a>
                  )}
                </article>
              ))}
            </div>

            <div className="border-t bg-gray-50 px-5 py-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-2">
                <FileText size={14} />
                বিভাগীয় নোটিশ
              </span>
            </div>
          </div>
        )}
      </section>
      </main>
    </PublicSiteLayout>
  );
}
