"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";

import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import FadeImage from "@/components/common/FadeImage";
import DefaultAvatar from "@/components/common/DefaultAvatar";
import { FacultyListCardSkeleton } from "@/components/common/Skeletons";
import { apiFetch } from "@/lib/api";
import type { Faculty } from "@/types/api";

function FacultyCard({
  person,
  index,
}: {
  person: Faculty;
  index: number;
}) {
  const hasContact = Boolean(person.phone || person.email);

  return (
    <article
      // Each card slides in as it scrolls into view. Cards in the same
      // row get a tiny stagger; nothing waits for the whole list.
      data-aos="fade-up"
      data-aos-delay={(index % 2) * 120}
      className="group flex gap-4 rounded-2xl border bg-white p-3 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:gap-5 sm:p-4"
    >
      {/* photo, left */}
      <div
        data-aos="zoom-in"
        data-aos-delay={(index % 2) * 120 + 150}
        className="relative aspect-[3/4] w-[38%] min-w-[104px] max-w-[210px] shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/5"
      >
        {person.image_url ? (
          <FadeImage
            src={person.image_url}
            alt={person.name}
            className="h-full w-full"
            imgClassName="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            fallback={<DefaultAvatar size={48} />}
          />
        ) : (
          <DefaultAvatar size={48} />
        )}
      </div>

      {/* basic details, right */}
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <h2 className="text-base font-bold leading-snug text-gray-800 sm:text-lg">
          {person.name}
        </h2>

        <p className="mt-1 text-sm font-semibold text-[#1b5e20]">
          {person.designation}
        </p>

        <span
          aria-hidden="true"
          className="mt-3 block h-0.5 w-10 rounded-full bg-gradient-to-r from-[#1b5e20] to-teal-500"
        />

        <div className="mt-3 space-y-2 text-sm text-gray-600">
          {person.phone && (
            <a
              href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-2 hover:text-[#1b5e20]"
            >
              <Phone size={15} className="shrink-0 text-[#1b5e20]" />
              <span className="min-w-0 break-words">
                {person.phone}
              </span>
            </a>
          )}

          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="flex items-start gap-2 hover:text-[#1b5e20]"
            >
              <Mail
                size={15}
                className="mt-0.5 shrink-0 text-[#1b5e20]"
              />
              <span className="min-w-0 break-all">
                {person.email}
              </span>
            </a>
          )}

          {!hasContact && (
            <p className="text-xs text-gray-400">
              যোগাযোগের তথ্য এখনো যোগ করা হয়নি
            </p>
          )}
        </div>

        {/* more info: bottom of the details column */}
        <div className="mt-auto pt-4">
          <Link
            href={`/faculty/${person.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/60 px-4 py-2 text-xs font-bold text-[#1b5e20] transition duration-300 hover:border-[#1b5e20] hover:bg-[#1b5e20] hover:text-white sm:text-sm"
          >
            আরও তথ্য
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

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

    void loadFaculty();
  }, []);

  return (
    <PublicSiteLayout>
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
            <div className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <FacultyListCardSkeleton key={index} />
              ))}
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
            <div className="grid gap-5 lg:grid-cols-2">
              {faculty.map((person, index) => (
                <FacultyCard
                  key={person.id}
                  person={person}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </PublicSiteLayout>
  );
}
