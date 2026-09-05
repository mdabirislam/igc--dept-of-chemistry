"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarPlus, Plus, X } from "lucide-react";

export interface EventData {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

interface EventFormProps {
  editingEvent?: EventData | null;
  onSave?: (event: EventData) => void;
  onCancelEdit?: () => void;
}

export default function EventForm({
  editingEvent,
  onSave,
  onCancelEdit,
}: EventFormProps) {
  const [open, setOpen] = useState(Boolean(editingEvent));

  const [title, setTitle] = useState(editingEvent?.title ?? "");
  const [date, setDate] = useState(editingEvent?.date ?? "");
  const [time, setTime] = useState(editingEvent?.time ?? "");
  const [location, setLocation] = useState(
    editingEvent?.location ?? ""
  );
  const [description, setDescription] = useState(
    editingEvent?.description ?? ""
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setOpen(true);
      setTitle(editingEvent.title);
      setDate(editingEvent.date);
      setTime(editingEvent.time);
      setLocation(editingEvent.location);
      setDescription(editingEvent.description);
    }
  }, [editingEvent]);

  function closeForm() {
    setOpen(false);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
    setError("");

    onCancelEdit?.();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("ইভেন্টের নাম লিখুন।");
      return;
    }

    if (!date) {
      setError("ইভেন্টের তারিখ নির্বাচন করুন।");
      return;
    }

    setSaving(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 400));

    const item: EventData = {
      id: editingEvent?.id ?? Date.now(),
      title: title.trim(),
      date,
      time,
      location: location.trim(),
      description: description.trim(),
    };

    onSave?.(item);

    setSaving(false);
    closeForm();
  }

  if (!open && !editingEvent) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#145218]"
      >
        <Plus size={17} />
        নতুন ইভেন্ট যোগ করুন
      </button>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="font-semibold text-gray-800">
            {editingEvent
              ? "ইভেন্ট সম্পাদনা"
              : "নতুন ইভেন্ট যোগ করুন"}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            বিভাগীয় অনুষ্ঠান ও গুরুত্বপূর্ণ event-এর তথ্য দিন
          </p>
        </div>

        <button
          type="button"
          onClick={closeForm}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <form
        onSubmit={submit}
        className="max-w-3xl space-y-5"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            ইভেন্টের নাম
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ইভেন্টের নাম"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              তারিখ
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              সময়
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            স্থান
          </label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ইভেন্টের স্থান"
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            বিস্তারিত
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ইভেন্টের বিস্তারিত..."
            className="w-full resize-y rounded-lg border px-3 py-2.5 text-sm"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={closeForm}
            className="rounded-lg border px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            বাতিল
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1b5e20] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <CalendarPlus size={16} />

            {saving
              ? "সংরক্ষণ হচ্ছে..."
              : editingEvent
                ? "পরিবর্তন সংরক্ষণ করুন"
                : "ইভেন্ট প্রকাশ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}