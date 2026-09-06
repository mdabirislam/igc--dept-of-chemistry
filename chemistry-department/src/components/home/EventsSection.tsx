"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import type { ApiEvent } from "@/types/api";

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
  const [events, setEvents] =
    useState<ApiEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data =
          await apiFetch<ApiEvent[]>(
            "/events/"
          );

        setEvents(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "ইভেন্ট লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays
              size={20}
              className="text-[#1b5e20]"
            />

            <h2 className="text-lg font-bold text-gray-800">
              আসন্ন ইভেন্ট
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            বিভাগের গুরুত্বপূর্ণ অনুষ্ঠান
          </p>
        </div>

        <a
          href="/events"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#1b5e20] hover:underline"
        >
          সব দেখুন
          <ArrowRight size={15} />
        </a>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          ইভেন্ট লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-600">
          ইভেন্ট লোড করা যায়নি।
        </div>
      ) : events.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          বর্তমানে কোনো ইভেন্ট নেই।
        </div>
      ) : (
        <div className="space-y-3">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="rounded-xl border p-4 transition hover:shadow-sm"
            >
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20]">
                  <CalendarDays size={19} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">
                    {event.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(event.date)}
                  </p>

                  {event.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}