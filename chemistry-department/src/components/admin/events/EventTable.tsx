"use client";

import {
  CalendarDays,
  Edit3,
  Trash2,
} from "lucide-react";

import type { EventData } from "./EventForm";

interface EventTableProps {
  events: EventData[];
  onEdit: (event: EventData) => void;
  onDelete: (id: number) => void;
}

export default function EventTable({
  events,
  onEdit,
  onDelete,
}: EventTableProps) {
  function deleteEvent(event: EventData) {
    const confirmed = window.confirm(
      `"${event.title}" মুছে ফেলতে চান?`
    );

    if (confirmed) {
      onDelete(event.id);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-gray-800">
            <CalendarDays
              size={18}
              className="text-[#1b5e20]"
            />
            প্রকাশিত ইভেন্ট
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            বিভাগীয় অনুষ্ঠান ও event-এর তালিকা
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#1b5e20]">
          {events.length} টি
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs text-gray-500">
              <th className="px-5 py-3 font-semibold">
                ইভেন্ট
              </th>

              <th className="px-5 py-3 font-semibold">
                তারিখ
              </th>

              <th className="px-5 py-3 font-semibold">
                সময়
              </th>

              <th className="px-5 py-3 font-semibold">
                স্থান
              </th>

              <th className="px-5 py-3 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b last:border-0 hover:bg-gray-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-[#1b5e20]">
                      <CalendarDays size={17} />
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        {event.title}
                      </p>

                      {event.description && (
                        <p className="mt-1 max-w-[350px] truncate text-xs text-gray-400">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {event.date}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {event.time || "—"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {event.location || "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEdit(event)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1b5e20]"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => deleteEvent(event)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {events.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          কোনো ইভেন্ট প্রকাশ করা হয়নি।
        </div>
      )}
    </section>
  );
}