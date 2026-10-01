"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";

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
  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data =
          await apiFetch<Event[]>(
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
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-transparent p-5">      
      <div className="flex shrink-0 items-center">
        <h2 className="relative w-full p-5 sm:p-1 sm:text-2xl text-xl text-center font-bold text-gray-800 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                 after:w-1/3 after:h-[2px] after:bg-[#1b5e20]">
          ইভেন্ট
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          ইভেন্ট লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center text-sm text-red-600">
          ইভেন্ট লোড করা যায়নি।
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          বর্তমানে কোনো ইভেন্ট নেই।
        </div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col  overflow-y-auto  overflow-x-hidden">
          <div className="mt-5 min-h-0 min-w-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden pr-1">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="min-w-0 p-4 transition hover:shadow-sm"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20]">
                    <CalendarDays size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-gray-800 [overflow-wrap:anywhere]">
                      {event.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(event.date)}
                    </p>

                    {event.location && (
                      <p className="mt-1 flex min-w-0 items-start gap-1 text-xs text-gray-500">
                        <MapPin
                          size={12}
                          className="mt-0.5 shrink-0"
                        />
                        <span className="break-words [overflow-wrap:anywhere]">
                          {event.location}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <a
              href="/events"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#1b5e20] hover:underline"
            >
              সব দেখুন
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}