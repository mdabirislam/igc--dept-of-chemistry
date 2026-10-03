"use client";

import { useEffect, useState } from "react";
import { ArrowRight, UserRound } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { Faculty } from "@/types/api";

// Function to map current list length to custom desktop grid layouts safely
function getGridColumnsClass(count: number): string {
  if (count === 2) return "lg:grid-cols-2";
  if (count === 3 || count === 5 || count === 6) return "lg:grid-cols-3";
  return "lg:grid-cols-4"; // Fallback for 4, 7, or greater amounts
}

export default function FacultyPreview() {
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
            : "শিক্ষক তালিকা লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadFaculty();
  }, []);

  return (
    <section className="bg-transparent lg:p-5 mt-5 lg:mt-0">
      {/* Header section preserved exactly as requested */}
      <div className="mb-2 flex items-center">
        <h2 className="relative w-full p-3 lg:pb-4 sm:p-1 sm:text-2xl text-xl text-center font-bold text-gray-800 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
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
        <div className="flex flex-col gap-8 pt-5 animate-fade-in-up">
          {/* Dynamic layout calculation applied through getGridColumnsClass */}
          <div className={`grid gap-4 sm:grid-cols-2 ${getGridColumnsClass(faculty.slice(0, 8).length)}`}>
            {faculty.slice(0, 8).map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-4 p-4 rounded-xl transition border border-transparent hover:border-slate-100 hover:bg-slate-50/50 hover:shadow-sm"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden bg-transparent rounded-sm border border-slate-100 shadow-sm flex items-center justify-center relative">
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
                    <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-50">
                      <UserRound size={25} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-800">
                    {person.name}
                  </h3>

                  <p className="mt-0.5 text-sm text-[#1b5e20] font-medium truncate">
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

          {/* Clean 'See All' button action block centered below the array grid */}
          <div className="flex justify-center">
            <a
              href="/faculty"
              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-500/20 text-slate-700 hover:text-emerald-800 font-bold px-8 py-2.5 rounded-xl text-xs md:text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              সব দেখুন
              <ArrowRight size={15} className="text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
