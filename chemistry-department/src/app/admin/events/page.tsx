"use client";

import { useEffect, useState } from "react";

import {
  apiDelete,
  apiFetch,
} from "@/lib/api";

import type { ApiEvent } from "@/types/api";

import EventForm, {
  EventData,
  mapApiEventToEventData,
} from "@/components/admin/events/EventForm";

import EventTable from "@/components/admin/events/EventTable";

export default function AdminEventsPage() {
  const [events, setEvents] =
    useState<EventData[]>([]);

  const [editingEvent, setEditingEvent] =
    useState<EventData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch<ApiEvent[]>(
        "/events/"
      );

      setEvents(
        data.map(mapApiEventToEventData)
      );
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

  useEffect(() => {
    loadEvents();
  }, []);

  function handleSave(event: EventData) {
    setEvents((current) => {
      const exists = current.some(
        (item) => item.id === event.id
      );

      if (exists) {
        return current.map((item) =>
          item.id === event.id ? event : item
        );
      }

      return [event, ...current];
    });

    setEditingEvent(null);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "এই ইভেন্টটি মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    try {
      await apiDelete(`/events/${id}/`);

      setEvents((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "ইভেন্ট মুছে ফেলা যায়নি।"
      );
    }
  }

  function handleEdit(event: EventData) {
    setEditingEvent(event);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-6 p-5 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            ইভেন্ট ব্যবস্থাপনা
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            বিভাগীয় অনুষ্ঠান ও গুরুত্বপূর্ণ ইভেন্ট পরিচালনা করুন।
          </p>
        </div>

        {!editingEvent && (
          <EventForm onSave={handleSave} />
        )}
      </div>

      {editingEvent && (
        <EventForm
          editingEvent={editingEvent}
          onSave={handleSave}
          onCancelEdit={() => setEditingEvent(null)}
        />
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
          ইভেন্ট লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <EventTable
          events={events}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}