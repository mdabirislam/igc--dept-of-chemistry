"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, FileText, FileDown, FileImage, FileVideo } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Resource } from "@/types/api";
import {ArrowRight} from "lucide-react";

// ফাইল এক্সটেনশন চেক করে নির্দিষ্ট মেটাডাটা ও আইকন রিটার্ন করার ফাংশন
function getResourceMeta(url: string | null) {
  if (!url) return { icon: <FileText size={18} />, badge: "ফাইল", badgeClass: "text-slate-700 bg-slate-100 border-slate-200" };
  
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return { 
        icon: <FileDown size={18} />, 
        badge: "PDF ডকুমেন্ট", 
        badgeClass: "text-rose-700 bg-rose-50/80 border-rose-100" 
      };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'svg':
      return { 
        icon: <FileImage size={18} />, 
        badge: "ছবি / ডায়াগ্রাম", 
        badgeClass: "text-blue-700 bg-blue-50/80 border-blue-100" 
      };
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
      return { 
        icon: <FileVideo size={18} />, 
        badge: "ভিডিও টিউটোরিয়াল", 
        badgeClass: "text-purple-700 bg-purple-50/80 border-purple-100" 
      };
    default:
      return { 
        icon: <FileText size={18} />, 
        badge: "নোটস / স্টাডি মেটেরিয়াল", 
        badgeClass: "text-emerald-700 bg-emerald-50/80 border-emerald-100" 
      };
  }
}

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
    <section className="flex min-w-0 flex-col bg-transparent lg:h-full lg:max-h-[420px] lg:min-h-0 lg:overflow-hidden">
      {/* হেডার টাইটেল - থিমের সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ */}
      <div className="flex shrink-0 items-center mb-4">
        <h2 className="w-full text-lg md:text-xl font-extrabold text-slate-800 bg-gradient-to-r from-emerald-50 via-slate-100 to-emerald-50 py-2.5 px-4 rounded-sm border border-slate-200/60 shadow-sm text-center tracking-wide">
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
        /* ইভেন্ট সেকশনের মতো সমান ভারসাম্যপূর্ণ ও তথ্যবহুল মডার্ন লেআউট */
        <div className="min-w-0 space-y-3.5 pr-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden animate-fade-in-up">
          {resources.slice(0, 4).map((resource) => {
            const { icon, badge, badgeClass } = getResourceMeta(resource.file_url);
            
            return (
              <a
                key={resource.id}
                href={resource.file_url ?? "#"}
                target={resource.file_url ? "_blank" : undefined}
                rel={resource.file_url ? "noopener noreferrer" : undefined}
                className="flex min-w-0 items-center gap-4 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:border-emerald-500/20 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-pointer"
              >
                {/* ফাইল ক্যাটাগরি অনুযায়ী আধুনিক স্পেসিফিক রাউন্ডেড আইকন বক্স */}
                <div className={`flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 shadow-sm ${badgeClass.split(' ')[1]} ${badgeClass.split(' ')[2]}`}>
                  <span className={badgeClass.split(' ')[0]}>{icon}</span>
                </div>

                {/* রিসোর্স টেক্সট ও মেটাডাটা ইনফো এরিয়া */}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h3 className="break-words font-bold text-sm md:text-base text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors [overflow-wrap:anywhere]">
                    {resource.title}
                  </h3>

                  {/* রিসোর্সের বিবরণ বা ডিফল্ট তথ্য */}
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1 break-words">
                    {(resource as any).description || "শিক্ষার্থীদের একাডেমিক সহায়তার জন্য রসায়ন বিভাগের একটি গুরুত্বপূর্ণ ফাইল।"}
                  </p>

                  {/* ডায়নামিক ব্যাজ ও ডাউনলোড ইনফো */}
                  <div className="mt-2 flex items-center gap-3">
                    <span className={`text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                      {badge}
                    </span>
                    <span className="text-[10px] md:text-[11px] font-semibold text-slate-400 font-mono">
                      অনলাইন সংস্করণ
                    </span>
                  </div>
                </div>

                {/* ইন্টারেক্টিভ ডাউনলোড বাটন অ্যাকশন */}
                {resource.file_url && (
                  <div className="text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 p-1.5 rounded-lg transition-all duration-200 self-center">
                    <ArrowDownToLine
                      size={16}
                      className="shrink-0 transition-transform duration-300 transform group-hover:translate-y-0.5"
                    />
                  </div>
                )}
              </a>
            );
          })}
          <div className="flex items-center justify-center p-1 lg:p-1 mt-auto pl-4 bg-gradient-to-t from-transparent via-white to-white">
            <a
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#1b5e20] hover:text-emerald-700 group transition-colors"
            >
              <span>সব দেখুন</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
