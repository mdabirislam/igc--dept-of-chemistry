"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { ApiNotice } from "@/types/api";

const categoryLabels: Record<string, string> = {
  academic: "একাডেমিক",
  exam: "পরীক্ষা",
  admission: "ভর্তি",
  general: "সাধারণ",
  event: "ইভেন্ট",
};

function toBanglaNumber(value: string | number) {
  return String(value).replace(/\d/g, (digit) => {
    const map: Record<string, string> = {
      "0": "০",
      "1": "১",
      "2": "২",
      "3": "৩",
      "4": "৪",
      "5": "৫",
      "6": "৬",
      "7": "৭",
      "8": "৮",
      "9": "৯",
    };

    return map[digit];
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticeSection() {
  const [notices, setNotices] = useState<ApiNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch<ApiNotice[]>(
          "/notices/"
        );

        setNotices(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "নোটিশ লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20]">
            <Bell size={18} />
          </div>

          <div>
            <h2 className="font-bold text-gray-800">
              নোটিশ বোর্ড
            </h2>

            <p className="text-xs text-gray-500">
              বিভাগের সর্বশেষ বিজ্ঞপ্তি
            </p>
          </div>
        </div>

        <a
          href="/notices"
          className="flex items-center gap-1 text-sm font-medium text-[#1b5e20] hover:underline"
        >
          সব দেখুন
          <ChevronRight size={16} />
        </a>
      </div>

      {loading ? (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          নোটিশ লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="px-5 py-10 text-center text-sm text-red-600">
          নোটিশ লোড করা যায়নি।
        </div>
      ) : notices.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          বর্তমানে কোনো নোটিশ নেই।
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">
                  ক্রম
                </th>

                <th className="px-5 py-3 font-semibold">
                  নোটিশ
                </th>

                <th className="px-5 py-3 font-semibold">
                  তারিখ
                </th>

                <th className="px-5 py-3 text-right font-semibold">
                  PDF
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {notices.slice(0, 8).map(
                (notice, index) => (
                  <tr
                    key={notice.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {toBanglaNumber(index + 1)}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {notice.title}
                        </p>

                        <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-[#1b5e20]">
                          {categoryLabels[
                            notice.category
                          ] ??
                            notice.category}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                      {formatDate(
                        notice.created_at
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {notice.pdf_url ? (
                        <a
                          href={notice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-[#1b5e20] hover:text-[#1b5e20]"
                        >
                          <Download size={14} />
                          PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t bg-gray-50 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText size={14} />
          সর্বশেষ ৮টি নোটিশ দেখানো হচ্ছে
        </div>
      </div>
    </section>
  );
}