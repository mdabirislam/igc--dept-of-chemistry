"use client";

import { useEffect, useState } from "react";
import { FileDown, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Notice } from "@/types/api";

const categoryLabels: Record<string, string> = {
  academic: "একাডেমিক",
  exam: "পরীক্ষা",
  admission: "ভর্তি",
  general: "সাধারণ",
  event: "ইভেন্ট",
};

// ক্যাটাগরি অনুযায়ী আধুনিক ডাইনামিক কালার ম্যাপিং
const categoryColors: Record<string, string> = {
  academic: "text-blue-700 bg-blue-50 border-blue-100",
  exam: "text-rose-700 bg-rose-50 border-rose-100",
  admission: "text-amber-700 bg-amber-50 border-amber-100",
  general: "text-slate-700 bg-slate-100 border-slate-200",
  event: "text-purple-700 bg-purple-50 border-purple-100",
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

// তারিখ থেকে দিন ও মাস আলাদা করার রিফাইনড ফাংশন
function getSplitDate(dateString: string) {
  const date = new Date(dateString);
  const day = toBanglaNumber(date.getDate());
  const month = date.toLocaleDateString("bn-BD", { month: "short" });
  return { day, month };
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
        const data = await apiFetch<Notice[]>("/notices/");
        setNotices(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "নোটিশ বোর্ড লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }
    loadNotices();
  }, []);

  return (
    <section className="flex min-w-0 lg:max-h-[80vh] h-full min-w-0 flex-col lg:col-span-2 overflow-hidden bg-transparent lg:px-5">
      {/* ১. আপনার পছন্দের সেই বেস্ট এবং সিম্পল হেডার স্টাইলটি ফিরিয়ে আনা হলো */}
      <div className="flex min-w-0 items-center justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 border-l-4 border-[#1b5e20] pl-3.5 tracking-wide">
            বিভাগীয় নোটিশ বোর্ড
          </h2>
        </div>
{/* 
        <a
          href="/notices"
          className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#1b5e20] hover:text-emerald-700 transition-colors group"
        >
          সব দেখুন
          <ChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </a> */}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500 animate-pulse py-12">
          নোটিশ লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center text-sm text-red-600 py-10">
          নোটিশ লোড করা যায়নি।
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500 py-12">
          বর্তমানে কোনো নোটিশ নেই।
        </div>
      ) : (
        /* স্লিক অ্যান্ড ক্লিন বর্ডারহীন নিউজ-লিস্ট লেআউট উইথ সফট এন্ট্রি অ্যানিমেশন */
        <div className="min-w-0 lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden space-y-3.5 animate-fade-in-up pr-1">
          {notices.slice(0, 6).map((notice) => {
            const { day, month } = getSplitDate(notice.created_at);
            const badgeColor = categoryColors[notice.category] ?? "text-slate-700 bg-slate-100 border-slate-200";

            return (
              <div
                key={notice.id}
                className="flex items-center gap-4 p-3 lg:pl-6 rounded-lg border border-slate-100/70 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:border-emerald-500/20 transition-all duration-300 group"
              >
                {/* ২. হাই-ফোকাস রিয়েল ক্যালেন্ডার শিট ডিজাইন (ফোকাস সমস্যার সমাধান) */}
                <div className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm transition-all duration-300 group-hover:border-emerald-600/30">
                  {/* ক্যালেন্ডারের ওপরের লাল/সবুজ বার ইমপ্রেশন */}
                  <span className="w-full h-3 md:h-3.5 bg-rose-600 group-hover:bg-[#1b5e20] transition-colors duration-300 block"></span>
                  
                  {/* বড় অক্ষরের হাইলাইট দিন */}
                  <span className="text-xl md:text-2xl font-black text-slate-800 mt-1 leading-none transition-colors group-hover:text-emerald-700">
                    {day}
                  </span>
                  {/* ছোট অক্ষরের মাস */}
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 mb-1 transition-colors group-hover:text-slate-500">
                    {month}
                  </span>
                </div>

                {/* নোটিশের মূল বিষয়বস্তু ও মেটাডাটা ব্যাজ */}
                <div className="min-w-0 flex-1 flex flex-col items-start justify-center">
                  <h3 className="break-words font-bold text-sm md:text-base text-slate-700 group-hover:text-emerald-950 transition-colors leading-snug [overflow-wrap:anywhere] line-clamp-2">
                    {notice.title}
                  </h3>
                  
                  <span className={`mt-2 inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] md:text-[11px] font-bold shadow-sm ${badgeColor}`}>
                    {categoryLabels[notice.category] ?? notice.category}
                  </span>
                </div>

                {/* ৩. সাধারণ ডাউনলোড আইকনের পরিবর্তে লাল রঙের ডেডিকেটেড মডার่น PDF বাটন */}
                <div className="pl-1 shrink-0">
                  {notice.pdf_url ? (
                    <a
                      href={notice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white px-2.5 py-2 md:px-3 md:py-2.5 text-xs font-black text-rose-600 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group/btn"
                      title="PDF ডাউনলোড করুন"
                    >
                      <FileDown size={14} className="shrink-0 text-rose-500 group-hover/btn:text-white transition-colors" />
                      <span className="hidden sm:inline-block tracking-wide">PDF</span>
                    </a>
                  ) : (
                    <div className="w-12 text-center text-xs font-bold text-slate-300 select-none">
                      —
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* নিচে সবগুলো দেখার জন্য একটি পরিচ্ছন্ন বাটন */}
          <div className="pt-2 text-right">
            <a
              href="/notices"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black text-[#1b5e20] hover:text-emerald-700 group transition-colors"
            >
              সবগুলো নোটিশ দেখুন
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
