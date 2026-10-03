"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, FileText } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Resource } from "@/types/api";

export default function ImportantResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResources() {
      try {
        const data = await apiFetch<Resource[]>("/resources/");
        setResources(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "রিসোর্স লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  return (
    <section className="flex min-w-0 flex-col bg-transparent lg:h-full lg:max-h-[420px] lg:min-h-0 lg:overflow-hidden p-1">
      {/* হেডার টাইটেল - ইভেন্ট সেকশনের সাথে হুবহু ম্যাচ করা হয়েছে */}
      <div className="flex shrink-0 items-center mb-4">
        <h2 className="w-full text-lg md:text-xl font-extrabold text-slate-800 bg-gradient-to-r from-emerald-50 via-slate-100 to-emerald-50 py-2.5 px-4 rounded-xl border border-slate-200/60 shadow-sm text-center tracking-wide">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-950 via-slate-800 to-emerald-900">
            গুরুত্বপূর্ণ রিসোর্স ও ডাউনলোড
          </span>
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500 animate-pulse">
          রিসোর্স লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center text-sm text-red-600">
          রিসোর্স লোড করা যায়নি।
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          বর্তমানে কোনো রিসোর্স নেই।
        </div>
      ) : (
        /* নন-ইরিটেটিং সফট এন্ট্রি অ্যানিমেশন (Event সেকশনের অনুরূপ) */
        <div className="min-w-0 space-y-3 pr-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden animate-fade-in-up">
          {resources.slice(0, 6).map((resource) => {
            return (
              <a
                key={resource.id}
                href={resource.file_url ?? "#"}
                target={resource.file_url ? "_blank" : undefined}
                rel={resource.file_url ? "noopener noreferrer" : undefined}
                className="flex min-w-0 items-center gap-4 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:border-emerald-500/20 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 group"
              >
                {/* ফাইল আইকন কন্টেনার */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#1b5e20] transition-colors group-hover:bg-emerald-500 group-hover:text-white duration-300">
                  <FileText size={19} />
                </div>

                {/* রিসোর্স টাইটেল */}
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition-colors [overflow-wrap:anywhere]">
                    {resource.title}
                  </p>
                </div>

                {/* ডাউনলোড সাইড আইকন */}
                {resource.file_url && (
                  <div className="p-1 rounded-lg text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all duration-200">
                    <ArrowDownToLine
                      size={17}
                      className="shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
                    />
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
