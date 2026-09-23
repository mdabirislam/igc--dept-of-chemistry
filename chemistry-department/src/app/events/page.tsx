 "use client";

import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, MapPin } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Event } from "@/types/api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventsPage() {
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
          error instanceof Error ? error.message : "ইভেন্ট লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
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
              <CalendarDays size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ইভেন্ট</h1>
              <p className="mt-1 text-sm text-white/75">
                রসায়ন বিভাগের অনুষ্ঠান ও গুরুত্বপূর্ণ কার্যক্রম
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-4 py-7 lg:px-6">
        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            ইভেন্ট লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            বর্তমানে কোনো ইভেন্ট নেই।
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1b5e20]">
                    <CalendarDays size={21} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-800">
                      {event.title}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-[#1b5e20]">
                      {formatDate(event.date)}
                    </p>

                    {event.location && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={15} />
                        {event.location}
                      </p>
                    )}

                    {event.details && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                        {event.details}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </main>
    </PublicSiteLayout>
  );
}
