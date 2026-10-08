"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Edit3,
  ExternalLink,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";

import {
  apiDelete,
  apiFetch,
  apiPost,
  apiPut,
} from "@/lib/api";
import type { GalleryCategory, GalleryItem } from "@/types/api";

import Field, { inputClass } from "@/components/admin/ui/Field";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import AdminLoading from "@/components/admin/ui/AdminLoading";
import AdminError from "@/components/admin/ui/AdminError";
import AdminEmpty from "@/components/admin/ui/AdminEmpty";
import { useDeleteConfirm } from "@/components/admin/ui/useDeleteConfirm";

const categories: { value: GalleryCategory; label: string }[] = [
  { value: "photo", label: "ছবি" },
  { value: "video", label: "ভিডিও" },
  { value: "wall_magazine", label: "দেয়ালিকা" },
];

function categoryLabel(value: GalleryCategory) {
  return (
    categories.find((item) => item.value === value)?.label ?? value
  );
}

function isHttpUrl(value: string) {
  return /^https?:\/\/\S+$/i.test(value);
}

/* ---------------- form ---------------- */

interface GalleryFormProps {
  editing: GalleryItem | null;
  defaultCategory: GalleryCategory;
  onSaved: (item: GalleryItem) => void;
  onClose: () => void;
}

function GalleryForm({
  editing,
  defaultCategory,
  onSaved,
  onClose,
}: GalleryFormProps) {
  const [category, setCategory] = useState<GalleryCategory>(
    editing?.category ?? defaultCategory
  );
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(
    editing?.description ?? ""
  );
  const [date, setDate] = useState(editing?.date ?? "");
  const [videoUrl, setVideoUrl] = useState(
    editing?.video_url ?? ""
  );
  const [image, setImage] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isVideo = category === "video";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("শিরোনাম লিখুন।");
      return;
    }

    if (isVideo) {
      if (!videoUrl.trim()) {
        setError("ভিডিওর link দিন।");
        return;
      }

      if (!isHttpUrl(videoUrl.trim())) {
        setError("Video link অবশ্যই http:// বা https:// দিয়ে শুরু হতে হবে।");
        return;
      }
    } else if (!image && !editing?.image_url) {
      setError("একটি ছবি নির্বাচন করুন।");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("category", category);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("date", date);
      formData.append(
        "video_url",
        isVideo ? videoUrl.trim() : ""
      );

      if (!isVideo && image) {
        formData.append("image", image);
      }

      const saved = editing
        ? await apiPut<GalleryItem>(
            `/gallery/${editing.id}/`,
            formData
          )
        : await apiPost<GalleryItem>("/gallery/", formData);

      onSaved(saved);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b pb-4">
        <h2 className="font-semibold text-gray-800">
          {editing ? "গ্যালারি আইটেম সম্পাদনা" : "নতুন আইটেম যোগ করুন"}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="ধরন">
            <select
              value={category}
              disabled={Boolean(editing)}
              onChange={(e) => {
                setCategory(e.target.value as GalleryCategory);
                setError("");
              }}
              className={`${inputClass} disabled:bg-gray-50`}
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="তারিখ (ঐচ্ছিক)">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="শিরোনাম" className="md:col-span-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="শিরোনাম"
              className={inputClass}
            />
          </Field>

          <Field
            label="বিবরণ (ঐচ্ছিক)"
            className="md:col-span-2"
          >
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </Field>

          {isVideo ? (
            <Field
              label="ভিডিও link"
              hint="YouTube বা Facebook ভিডিওর link দিন।"
              className="md:col-span-2"
            >
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={inputClass}
              />
            </Field>
          ) : (
            <Field
              label={
                category === "wall_magazine"
                  ? "দেয়ালিকার ছবি"
                  : "ছবি"
              }
              hint="সর্বোচ্চ 5 MB"
              className="md:col-span-2"
            >
              <ImagePicker
                file={image}
                existingUrl={editing?.image_url}
                onChange={setImage}
                onError={setError}
                className="h-56"
              />
            </Field>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
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
              : editing
                ? "পরিবর্তন সংরক্ষণ করুন"
                : "সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* ---------------- manager ---------------- */

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [filter, setFilter] = useState<"all" | GalleryCategory>(
    "all"
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setLoadError("");

        setItems(await apiFetch<GalleryItem[]>("/gallery/"));
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "গ্যালারি লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [reloadKey]);

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  function handleSaved(item: GalleryItem) {
    setItems((current) => {
      const exists = current.some((entry) => entry.id === item.id);

      return exists
        ? current.map((entry) =>
            entry.id === item.id ? item : entry
          )
        : [item, ...current];
    });

    closeForm();
  }

  function startEdit(item: GalleryItem) {
    setEditing(item);
    setFormOpen(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const { requestDelete, dialog } = useDeleteConfirm<GalleryItem>({
    onDelete: async (item) => {
      await apiDelete(`/gallery/${item.id}/`);

      setItems((current) =>
        current.filter((entry) => entry.id !== item.id)
      );
    },
    title: () => "গ্যালারি আইটেম মুছে ফেলবেন?",
    description: (item) =>
      `"${item.title}" স্থায়ীভাবে মুছে যাবে। এই কাজটি আর undo করা যাবে না।`,
    fallbackError: "মুছে ফেলা যায়নি।",
  });

  const visible =
    filter === "all"
      ? items
      : items.filter((item) => item.category === filter);

  const tabs: { value: "all" | GalleryCategory; label: string }[] = [
    { value: "all", label: "সব" },
    ...categories,
  ];

  return (
    <div className="space-y-6">
      {!formOpen && (
        <div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#145218]"
          >
            <Plus size={17} />
            নতুন আইটেম যোগ করুন
          </button>
        </div>
      )}

      {formOpen && (
        <GalleryForm
          key={editing?.id ?? "new"}
          editing={editing}
          defaultCategory={filter === "all" ? "photo" : filter}
          onSaved={handleSaved}
          onClose={closeForm}
        />
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count =
            tab.value === "all"
              ? items.length
              : items.filter(
                  (item) => item.category === tab.value
                ).length;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                filter === tab.value
                  ? "border-[#1b5e20] bg-green-50 font-semibold text-[#1b5e20]"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <AdminLoading text="গ্যালারি লোড হচ্ছে..." />
      ) : loadError ? (
        <AdminError
          message={loadError}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      ) : visible.length === 0 ? (
        <AdminEmpty
          title="কোনো আইটেম নেই"
          description="নতুন আইটেম যোগ করতে উপরের বাটনে ক্লিক করুন।"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                {item.category === "video" ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                    <Video size={34} />

                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#1b5e20] hover:underline"
                    >
                      ভিডিও খুলুন
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ) : (
                  item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )
                )}

                <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-[#1b5e20] shadow-sm">
                  {categoryLabel(item.category)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 p-4">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  {item.date && (
                    <p className="mt-1 text-xs text-gray-400">
                      {item.date}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => startEdit(item)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1b5e20]"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    title="Delete"
                    onClick={() => requestDelete(item)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {dialog}
    </div>
  );
}
