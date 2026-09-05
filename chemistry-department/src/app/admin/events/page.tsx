"use client";

import { useState } from "react";

import EventForm, {
  EventData,
} from "@/components/admin/events/EventForm";

import EventTable from "@/components/admin/events/EventTable";

const initialEvents: EventData[] = [
  {
    id: 1,
    title: "বিভাগীয় সেমিনার",
    date: "2026-09-15",
    time: "10:30",
    location: "Chemistry Department",
    description:
      "রসায়ন বিভাগের উদ্যোগে বিশেষ সেমিনার।",
  },
  {
    id: 2,
    title: "Freshers Reception",
    date: "2026-09-25",
    time: "11:00",
    location: "College Auditorium",
    description:
      "নতুন শিক্ষার্থীদের সংবর্ধনা অনুষ্ঠান।",
  },
];

export default function AdminEventsPage() {
  const [events, setEvents] =
    useState<EventData[]>(initialEvents);

  const [editingEvent, setEditingEvent] =
    useState<EventData | null>(null);

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

  function handleDelete(id: number) {
    setEvents((current) =>
      current.filter((item) => item.id !== id)
    );
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

      <EventTable
        events={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}