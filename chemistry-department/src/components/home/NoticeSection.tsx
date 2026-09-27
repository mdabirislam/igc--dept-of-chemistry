"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Download,
  FileText,
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
    <section className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-bold text-xl text-gray-800">
              নোটিশ বোর্ড
            </h1>

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
        <div className="overflow-hidden w-full px-6 pb-6">
          <table className="w-full text-sm border-collapse border">
            <thead className="bg-gray-50 text-center text-xs text-gray-700 border-b">
              <tr>
                <th className="w-[10%] px-5 py-3 font-semibold font-medium border-r">
                  ক্রম
                </th> 

                <th className="w-[10%] px-5 py-3 font-semibold font-medium border-r">
                  নোটিশ
                </th>

                <th className="w-[50%] px-5 py-3 font-semibold font-medium border-r">
                  তারিখ
                </th>

                <th className="w-[10%] px-5 py-3 font-semibold font-medium">
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
                    <td className="px-5 py-4 text-gray-500 border-r">
                      {toBanglaNumber(index + 1)}
                    </td>

                    <td className="px-5 py-4 border-r">
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

                    <td className="whitespace-nowrap px-5 py-4 text-gray-500 border-r">
                      {formatDate(
                        notice.created_at
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {notice.pdf_url ? (
                        <a
                          href={notice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg  px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-[#1b5e20] hover:text-[#1b5e20]"
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
    </section>
  );
}