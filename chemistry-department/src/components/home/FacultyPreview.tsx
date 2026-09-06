"use client";

import { useEffect, useState } from "react";

import {
  ArrowRight,
  GraduationCap,
  UserRound,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import type { ApiFaculty } from "@/types/api";

export default function FacultyPreview() {
  const [faculty, setFaculty] =
    useState<ApiFaculty[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadFaculty() {
      try {
        const data =
          await apiFetch<ApiFaculty[]>(
            "/faculty/"
          );

        setFaculty(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "শিক্ষক তালিকা লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadFaculty();
  }, []);

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap
              size={20}
              className="text-[#1b5e20]"
            />

            <h2 className="text-lg font-bold text-gray-800">
              শিক্ষকবৃন্দ
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            রসায়ন বিভাগের শিক্ষক ও কর্মকর্তাবৃন্দ
          </p>
        </div>

        <a
          href="/faculty"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#1b5e20] hover:underline"
        >
          সব দেখুন
          <ArrowRight size={15} />
        </a>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          শিক্ষক তালিকা লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-600">
          শিক্ষক তালিকা লোড করা যায়নি।
        </div>
      ) : faculty.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          বর্তমানে কোনো শিক্ষক তথ্য নেই।
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {faculty.slice(0, 4).map((person) => (
            <div
              key={person.id}
              className="flex items-center gap-4 rounded-xl border p-4 transition hover:shadow-sm"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
                {person.image_url ? (
                  <img
                    src={person.image_url}
                    alt={person.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <UserRound size={25} />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-semibold text-gray-800">
                  {person.name}
                </h3>

                <p className="mt-1 text-sm text-[#1b5e20]">
                  {person.designation}
                </p>

                {person.qualification && (
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {person.qualification}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}