"use client";

import { useEffect, useState } from "react";

import {
  ArrowDownToLine,
  BookOpen,
  FileText,
  FlaskConical,
  NotebookPen,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import type { ApiResource } from "@/types/api";

const typeLabels: Record<string, string> = {
  note: "নোট",
  "question-paper": "প্রশ্নপত্র",
  "lab-manual": "ল্যাব ম্যানুয়াল",
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

export default function ImportantResources() {
  const [resources, setResources] =
    useState<ApiResource[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadResources() {
      try {
        const data =
          await apiFetch<ApiResource[]>(
            "/resources/"
          );

        setResources(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "রিসোর্স লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <BookOpen
            size={20}
            className="text-[#1b5e20]"
          />

          <h2 className="text-lg font-bold text-gray-800">
            গুরুত্বপূর্ণ রিসোর্স
          </h2>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          শিক্ষার্থীদের প্রয়োজনীয় শিক্ষা উপকরণ
        </p>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          রিসোর্স লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-600">
          রিসোর্স লোড করা যায়নি।
        </div>
      ) : resources.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          বর্তমানে কোনো রিসোর্স নেই।
        </div>
      ) : (
        <div className="space-y-3">
          {resources.slice(0, 6).map((resource) => {
            const Icon = getIcon(resource.type);

            return (
              <a
                key={resource.id}
                href={
                  resource.file_url ??
                  "#"
                }
                target={
                  resource.file_url
                    ? "_blank"
                    : undefined
                }
                rel={
                  resource.file_url
                    ? "noopener noreferrer"
                    : undefined
                }
                className="flex items-center gap-3 rounded-lg border p-3 transition hover:border-[#1b5e20] hover:bg-green-50/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20]">
                  <Icon size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {resource.title}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {typeLabels[
                      resource.type
                    ] ?? resource.type}
                  </p>
                </div>

                {resource.file_url && (
                  <ArrowDownToLine
                    size={17}
                    className="shrink-0 text-gray-400"
                  />
                )}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}