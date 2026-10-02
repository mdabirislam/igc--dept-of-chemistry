"use client";

import { useEffect, useState } from "react";

import {
  ChevronRight,
  Download,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Notice } from "@/types/api";

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
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch<Notice[]>(
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
    <section className="flex min-h-0 lg:max-h-[80vh] h-full min-w-0 flex-col lg:col-span-2  overflow-hidden bg-transparent shadow-sm">
      <div className="flex min-w-0 items-center justify-between gap-4 px-4 py-2 lg:py-4 sm:px-5">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold text-gray-800 [overflow-wrap:anywhere] lg:pl">
            নোটিশ বোর্ড
          </h1>
        </div>

        <a
          href="/notices"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#1b5e20] hover:underline"
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
        <div className="min-w-0 px-3 pb-6 sm:px-6 lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden">
          <table className="w-full min-w-0 table-fixed border-collapse border text-sm">
            <thead className="border-b text-center text-xs text-gray-700">
              <tr>
                <th className="w-[8%] border-r px-2 py-3 font-semibold sm:px-3">
                  ক্রম
                </th>

                <th className="w-[57%] border-r px-2 py-3 text-left font-semibold sm:px-4">
                  নোটিশ
                </th>

                <th className="w-[23%] border-r px-2 py-3 font-semibold sm:px-3">
                  তারিখ
                </th>

                <th className="w-[12%] px-1 py-3 font-semibold sm:px-2">
                  PDF
                </th>
              </tr>
            </thead>

            <tbody className="divide-y lg:overflow-y-auto lg:overflow-x-hidden">
              {notices.slice(0, 10).map(
                (notice, index) => (
                  <tr
                    key={notice.id}
                    className="text-center transition hover:bg-gray-50"
                  >
                    <td className="border-r px-1 py-4 text-gray-500 sm:px-3">
                      {toBanglaNumber(index + 1)}
                    </td>

                    <td className="border-r px-2 py-4 text-left sm:px-4">
                      <div className="min-w-0">
                        <p className="break-words font-medium text-gray-800 [overflow-wrap:anywhere]">
                          {notice.title}
                        </p>

                        <span className="mt-1 inline-flex max-w-full break-words rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-[#1b5e20]">
                          {categoryLabels[
                            notice.category
                          ] ?? notice.category}
                        </span>
                      </div>
                    </td>

                    <td className="border-r px-1 py-4 text-xs text-gray-500 sm:px-3 sm:text-sm">
                      <span className="break-words">
                        {formatDate(
                          notice.created_at
                        )}
                      </span>
                    </td>

                    <td className="px-1 py-4 text-center sm:px-2">
                      {notice.pdf_url ? (
                        <a
                          href={notice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-xs font-medium text-gray-600 transition hover:text-[#1b5e20] sm:gap-1.5 sm:px-3"
                        >
                          <Download
                            size={14}
                            className="shrink-0"
                          />
                          <span>PDF</span>
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
    </section>
  );
}