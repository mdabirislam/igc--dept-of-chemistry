 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  BookOpen,
  ChevronLeft,
  FileText,
  FlaskConical,
  NotebookPen,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Resource } from "@/types/api";

const typeLabels: Record<string, string> = {
  note: "নোট",
  "question-paper": "প্রশ্নপত্র",
  "lab-manual": "ল্যাব ম্যানুয়াল",
  download: "ডাউনলোড",
};

function getIcon(type: string) {
  switch (type) {
    case "question-paper":
      return FileText;
    case "lab-manual":
      return FlaskConical;
    case "download":
      return ArrowDownToLine;
    default:
      return NotebookPen;
  }
}

export default function ResourcesPage() {
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
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">শিক্ষাসামগ্রী ও রিসোর্স</h1>
              <p className="mt-1 text-sm text-white/75">
                শিক্ষার্থীদের জন্য প্রয়োজনীয় নোট, প্রশ্নপত্র ও ল্যাব ম্যানুয়াল
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-7 lg:px-6">
        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            রিসোর্স লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            বর্তমানে কোনো রিসোর্স নেই।
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = getIcon(resource.type);

              return (
                <article
                  key={resource.id}
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20]">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-800">
                        {resource.title}
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        {typeLabels[resource.type] ?? resource.type}
                      </p>
                    </div>
                  </div>

                  {resource.file_url ? (
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#145218]"
                    >
                      <ArrowDownToLine size={16} />
                      ফাইল দেখুন / ডাউনলোড
                    </a>
                  ) : (
                    <p className="mt-5 rounded-lg bg-gray-50 px-3 py-2.5 text-center text-xs text-gray-400">
                      ফাইল এখনো সংযুক্ত করা হয়নি
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
