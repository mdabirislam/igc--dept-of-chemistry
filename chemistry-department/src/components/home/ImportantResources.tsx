"use client";

import { useEffect, useState } from "react";

import {
  ArrowDownToLine,
  FileText,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import type { Resource } from "@/types/api";

export default function ImportantResources() {
  const [resources, setResources] =
    useState<Resource[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadResources() {
      try {
        const data =
          await apiFetch<Resource[]>(
            "/resources/"
          );

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
    <section className="flex min-w-0 flex-col bg-transparent lg:h-full lg:max-h-[350px] lg:min-h-0 lg:overflow-hidden">
        <div className="flex items-center border-b border-gray-100 pb-5">
          <h2 className="relative w-full p-5 sm:p-1 sm:text-2xl text-xl lg:text-xl text-center font-bold text-gray-800 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                 after:w-1/3 after:h-[2px] after:bg-[#1b5e20]">
            গুরুত্বপূর্ণ রিসোর্স
          </h2>
        </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          রিসোর্স লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-600">
          রিসোর্স লোড করা যায়নি।
        </div>
      ) : resources.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          বর্তমানে কোনো রিসোর্স নেই।
        </div>
      ) : (
        <div className="min-w-0 space-y-3 pr-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden">
          {resources.slice(0, 6).map((resource) => {
            return (
              <a
                key={resource.id}
                href={resource.file_url ?? "#"}
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
                className="flex min-w-0 items-start gap-3 p-3 transition hover:border-[#1b5e20] hover:bg-green-50/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20]">
                  <FileText size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-gray-800 [overflow-wrap:anywhere]">
                    {resource.title}
                  </p>
                </div>

                {resource.file_url && (
                  <ArrowDownToLine
                    size={17}
                    className="mt-0.5 shrink-0 text-gray-400"
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
