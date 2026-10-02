"use client";

import { useEffect, useState } from "react";

import {
  ArrowRight,
  UserRound,
} from "lucide-react";

import Image from "next/image";

import { apiFetch } from "@/lib/api";

import type { Faculty } from "@/types/api";

export default function FacultyPreview() {
  const [faculty, setFaculty] =
    useState<Faculty[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadFaculty() {
      try {
        const data =
          await apiFetch<Faculty[]>(
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
    <section className="bg-transparent p-5">
          <div className="flex items-center">
            <h2 className="relative w-full p-5 lg:p-5 sm:p-1 sm:text-2xl text-xl text-center font-bold text-gray-800 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                 after:w-1/3 after:h-[2px] after:bg-[#1b5e20]">
              শিক্ষকবৃন্দ
            </h2>
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
        <div className="grid gap-4 sm:grid-cols-2 pt-5">
          {faculty.slice(0, 4).map((person) => (
            <div
              key={person.id}
              className="flex items-center gap-4 p-4 transition hover:shadow-sm"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden bg-transparent">
                {person.image_url ? (
                  <Image
                    src={person.image_url}
                    alt={person.name}
                    width={64}
                    height={64}
                    unoptimized
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
          
        <a
          href="/faculty"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#1b5e20] hover:underline"
        >
          সব দেখুন
          <ArrowRight size={15} />
        </a>
        </div>
      )}
    </section>
  );
}