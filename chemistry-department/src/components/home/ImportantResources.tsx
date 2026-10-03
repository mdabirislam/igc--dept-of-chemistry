"use client";

import { useEffect, useState } from "react";
import { 
  ArrowDownToLine, 
  FileText, 
  FileDown, 
  FileImage, 
  FileVideo 
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Resource } from "@/types/api";

// ফাইল এক্সটেনশন চেক করে নির্দিষ্ট কালারফুল আইকন রিটার্ন করার ফাংশন
function getResourceIcon(url: string | null) {
  if (!url) return { icon: <FileText size={18} />, colorClass: "text-slate-500 bg-slate-100" };
  
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return { 
        icon: <FileDown size={18} />, 
        colorClass: "text-rose-600 bg-rose-50 border-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
      };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'svg':
      return { 
        icon: <FileImage size={18} />, 
        colorClass: "text-blue-600 bg-blue-50 border-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
      };
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
      return { 
        icon: <FileVideo size={18} />, 
        colorClass: "text-purple-600 bg-purple-50 border-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
      };
    default:
      return { 
        icon: <FileText size={18} />, 
        colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
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
    <section className="flex min-w-0 flex-col bg-transparent lg:h-full lg:max-h-[420px] lg:min-h-0 lg:overflow-hidden p-1">
      {/* সেকশন হেডার টাইটেল */}
      <div className="flex shrink-0 items-center mb-6">
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
        /* বর্ডারলেস স্লিক লাইন-লিস্ট লেআউট */
        <div className="min-w-0 divide-y divide-slate-100 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden animate-fade-in-up">
          {resources.slice(0, 6).map((resource) => {
            const { icon, colorClass } = getResourceIcon(resource.file_url);
            
            return (
              <a
                key={resource.id}
                href={resource.file_url ?? "#"}
                target={resource.file_url ? "_blank" : undefined}
                rel={resource.file_url ? "noopener noreferrer" : undefined}
                className="flex min-w-0 items-center gap-4 py-3.5 px-2 transition-all duration-300 group hover:bg-slate-50/50 rounded-xl"
              >
                {/* অ্যাক্টিভ গ্লো-ডট ইন্ডিকেটর */}
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 group-hover:bg-emerald-600 group-hover:scale-125 transition-all duration-300" />

                {/* ফাইল টাইপ অনুযায়ী ডেডিকেটেড কালারফুল আইকন */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 ${colorClass}`}>
                  {icon}
                </div>

                {/* টাইটেল টেক্সট */}
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-slate-700 group-hover:text-emerald-800 transition-colors line-clamp-1 [overflow-wrap:anywhere]">
                    {resource.title}
                  </p>
                </div>

                {/* ডাউনলোড সাইড আইকন */}
                {resource.file_url && (
                  <div className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-200 pl-2">
                    <ArrowDownToLine
                      size={16}
                      className="shrink-0 transition-transform duration-300 transform group-hover:translate-y-0.5"
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
