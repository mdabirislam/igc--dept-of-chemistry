"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { Event } from "@/types/api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "bn-BD",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiFetch<Event[]>("/events/");
        setEvents(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "ইভেন্ট লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <section className="flex min-w-0 flex-col bg-transparent lg:h-full lg:max-h-[420px] lg:min-h-0 lg:overflow-hidden">
      {/* ইভেন্ট সেকশন হেডার - মডার্ন প্রিমিয়াম লুক */}
      <div className="flex shrink-0 items-center mb-4">
        <h2 className="w-full text-lg md:text-xl font-extrabold text-slate-800 bg-gradient-to-r from-emerald-50 via-slate-100 to-emerald-50 py-2.5 px-4 rounded-sm border border-slate-200/60 shadow-sm text-center tracking-wide">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-950 via-slate-800 to-emerald-900">
            সর্বশেষ ঘটনাবলী ও ইভেন্ট
          </span>
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500 animate-pulse">
          ইভেন্ট লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center text-sm text-red-600">
          ইভেন্ট লোড করা যায়নি।
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          বর্তমানে কোনো ইভেন্ট নেই।
        </div>
      ) : (
        <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden">
          {/* নন-ইরিটেটিং এবং চোখ-বান্ধব এন্ট্রি অ্যানিমেশন ক্লাস যুক্ত করা হয়েছে */}
          <div className="min-w-0 space-y-3.5 pr-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden animate-fade-in-up">
            {events.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="min-w-0 p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:border-emerald-500/20 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-pointer"
              >
                {/* নিউজ স্টাইল লেআউট (ইমেজ + পাশে বোল্ড টাইটেল ও বিবরণ) */}
                <div className="flex min-w-0 gap-4">
                  {/* ছোট ইমেজ থাম্বনেইল */}
                  <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
                    <Image
                      src={event.image_url || "/images/background/bg-1.jpg"}
                      alt={event.title}
                      fill
                      unoptimized={Boolean(event.image_url)}
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* টেক্সট কন্টেন্ট এরিয়া */}
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h3 className="break-words font-bold text-sm md:text-base text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors [overflow-wrap:anywhere]">
                      {event.title}
                    </h3>

                    {/* ডেসক্রিপশন ফিল্ড থাকলে দেখাবে, না থাকলে ডিফল্ট সাবটাইটেল */}
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1 break-words">
                      {event.details || "ঈশ্বরদী সরকারি কলেজের রসায়ন বিভাগের একটি বিশেষ আয়োজন।"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {formatDate(event.date)}
                      </span>

                      {event.location && (
                        <p className="flex min-w-0 items-center gap-1 text-[11px] text-gray-400">
                          <MapPin size={11} className="shrink-0" />
                          <span className="truncate max-w-[140px] md:max-w-[200px]">
                            {event.location}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {/* নিচের অ্যাকশন বাটন */}
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
        </div>
      )}
    </section>
  );
}
