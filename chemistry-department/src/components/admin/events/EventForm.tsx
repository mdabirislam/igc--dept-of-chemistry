"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";

import { apiPost, apiPut } from "@/lib/api";
import type { Event } from "@/types/api";

import Field, { inputClass } from "@/components/admin/ui/Field";
import ImagePicker from "@/components/admin/ui/ImagePicker";

export interface EventData {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
}

interface EventFormProps {
  editingEvent?: EventData | null;
  onSave?: (event: EventData) => void;
  onCancelEdit?: () => void;
}

export function mapEventToEventData(event: Event): EventData {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    time: "",
    location: event.location,
    description: event.details,
    imageUrl: event.image_url ?? undefined,
  };
}

export default function EventForm({
  editingEvent,
  onSave,
  onCancelEdit,
}: EventFormProps) {
  const [open, setOpen] = useState(Boolean(editingEvent));
  const [title, setTitle] = useState(editingEvent?.title ?? "");
  const [date, setDate] = useState(editingEvent?.date ?? "");
  const [location, setLocation] = useState(
    editingEvent?.location ?? ""
  );
  const [description, setDescription] = useState(
    editingEvent?.description ?? ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setTitle("");
    setDate("");
    setLocation("");
    setDescription("");
    setImage(null);
    setRemoveImage(false);
    setError("");
    setSaving(false);
  }

  function closeForm() {
    resetForm();
    setOpen(false);
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

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("date", date);
      formData.append("location", location.trim());
      formData.append("details", description.trim());

      if (image) {
        formData.append("image", image);
      } else if (removeImage && editingEvent?.imageUrl) {
        // An empty value clears the saved image.
        formData.append("image", "");
      }

      const saved = editingEvent
        ? await apiPut<Event>(
            `/events/${editingEvent.id}/`,
            formData
          )
        : await apiPost<Event>("/events/", formData);

      onSave?.(mapEventToEventData(saved));

      resetForm();
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ইভেন্ট সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
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
            বিভাগীয় অনুষ্ঠান ও গুরুত্বপূর্ণ event-এর তথ্য দিন
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

      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="ইভেন্টের নাম" className="md:col-span-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ইভেন্টের নাম"
              className={inputClass}
            />
          </Field>

          <Field label="তারিখ">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="স্থান">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ইভেন্টের স্থান"
              className={inputClass}
            />
          </Field>

          <Field label="বিস্তারিত" className="md:col-span-2">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ইভেন্টের বিস্তারিত..."
              className={`${inputClass} resize-y`}
            />
          </Field>

          <Field
            label="ইভেন্টের ছবি"
            hint="হোম পেজে ছোট থাম্বনেইল হিসেবে দেখানো হবে। ছবি না দিলে default ছবি দেখাবে।"
            className="md:col-span-2"
          >
            <ImagePicker
              file={image}
              existingUrl={editingEvent?.imageUrl}
              removed={removeImage}
              onChange={(file) => {
                setImage(file);
                if (file) setRemoveImage(false);
              }}
              onRemove={
                editingEvent?.imageUrl || image
                  ? () => setRemoveImage(true)
                  : undefined
              }
              onError={setError}
            />
          </Field>
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
            disabled={saving}
            className="rounded-lg border px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            বাতিল
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#1b5e20] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#145218] disabled:opacity-60"
          >
            {saving
              ? "সংরক্ষণ হচ্ছে..."
              : editingEvent
                ? "পরিবর্তন সংরক্ষণ করুন"
                : "ইভেন্ট সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}
