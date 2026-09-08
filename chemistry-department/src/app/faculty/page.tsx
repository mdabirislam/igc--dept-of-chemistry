 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, GraduationCap, UserRound } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Faculty } from "@/types/api";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFaculty() {
      try {
        const data = await apiFetch<Faculty[]>("/faculty/");
        setFaculty(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "শিক্ষক তালিকা লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadFaculty();
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
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">শিক্ষকবৃন্দ</h1>
              <p className="mt-1 text-sm text-white/75">
                রসায়ন বিভাগের শিক্ষক ও কর্মকর্তাবৃন্দ
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-7 lg:px-6">
        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            শিক্ষক তালিকা লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : faculty.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            বর্তমানে কোনো শিক্ষক তথ্য নেই।
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((person) => (
              <article
                key={person.id}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {person.image_url ? (
                      <img
                        src={person.image_url}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <UserRound size={30} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-800">{person.name}</h2>
                    <p className="mt-1 text-sm font-medium text-[#1b5e20]">
                      {person.designation}
                    </p>
                  </div>
                </div>

                {person.qualification && (
                  <div className="mt-5 border-t pt-4">
                    <p className="text-xs font-semibold text-gray-400">
                      শিক্ষাগত যোগ্যতা
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {person.qualification}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
