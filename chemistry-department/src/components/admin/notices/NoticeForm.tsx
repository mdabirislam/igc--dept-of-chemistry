"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FileUp, Plus, X } from "lucide-react";

import {
  apiPost,
  apiPut,
} from "@/lib/api";

import type { ApiNotice } from "@/types/api";

export interface NoticeData {
  id: number;
  title: string;
  category: string;
  details: string;
  date: string;
  time: string;
  pdfName?: string;
  pdfUrl?: string;
}

interface NoticeFormProps {
  editingNotice?: NoticeData | null;
  onSave?: (notice: NoticeData) => void;
  onCancelEdit?: () => void;
}

const categories = [
  { value: "academic", label: "একাডেমিক" },
  { value: "exam", label: "পরীক্ষা" },
  { value: "admission", label: "ভর্তি" },
  { value: "general", label: "সাধারণ" },
  { value: "event", label: "ইভেন্ট" },
];

function categoryLabel(value: string) {
  return (
    categories.find((item) => item.value === value)?.label ??
    value
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  return {
    date: date.toLocaleDateString("bn-BD", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export function mapApiNoticeToNoticeData(
  notice: ApiNotice
): NoticeData {
  const formatted = formatDateTime(notice.created_at);

  return {
    id: notice.id,
    title: notice.title,
    category: categoryLabel(notice.category),
    details: notice.details,
    date: formatted.date,
    time: formatted.time,
    pdfName: notice.pdf
      ? notice.pdf.split("/").pop()
      : undefined,
    pdfUrl: notice.pdf_url ?? undefined,
  };
}

export function getNoticeCategoryValue(
  label: string
) {
  return (
    categories.find((item) => item.label === label)?.value ??
    label
  );
}

export default function NoticeForm({
  editingNotice,
  onSave,
  onCancelEdit,
}: NoticeFormProps) {
  const [open, setOpen] = useState(
    Boolean(editingNotice)
  );

  const [title, setTitle] = useState(
    editingNotice?.title ?? ""
  );

  const [category, setCategory] = useState(
    getNoticeCategoryValue(
      editingNotice?.category ?? ""
    )
  );

  const [details, setDetails] = useState(
    editingNotice?.details ?? ""
  );

  const [pdf, setPdf] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingNotice) return;

    setOpen(true);
    setTitle(editingNotice.title);
    setCategory(
      getNoticeCategoryValue(editingNotice.category)
    );
    setDetails(editingNotice.details);
    setPdf(null);
  }, [editingNotice]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("শুধুমাত্র PDF file নির্বাচন করুন।");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "PDF file-এর size সর্বোচ্চ 10 MB হতে হবে।"
      );
      return;
    }

    setError("");
    setPdf(file);
  }

  function resetForm() {
    setTitle("");
    setCategory("");
    setDetails("");
    setPdf(null);
    setError("");
    setSaving(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function closeForm() {
    resetForm();
    setOpen(false);
    onCancelEdit?.();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("নোটিশের শিরোনাম লিখুন।");
      return;
    }

    if (!category) {
      setError("ক্যাটাগরি নির্বাচন করুন।");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("details", details.trim());

      if (pdf) {
        formData.append("pdf", pdf);
      }

      let saved: ApiNotice;

      if (editingNotice) {
        saved = await apiPut<ApiNotice>(
          `/notices/${editingNotice.id}/`,
          formData
        );
      } else {
        saved = await apiPost<ApiNotice>(
          "/notices/",
          formData
        );
      }

      onSave?.(mapApiNoticeToNoticeData(saved));

      resetForm();
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "নোটিশ সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  }

  if (!open && !editingNotice) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#145218]"
      >
        <Plus size={17} />
        নতুন নোটিশ
      </button>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="font-semibold text-gray-800">
            {editingNotice
              ? "নোটিশ সম্পাদনা"
              : "নতুন নোটিশ প্রকাশ"}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            নোটিশের তথ্য এবং PDF সংযুক্ত করুন
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
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            নোটিশের শিরোনাম
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="নোটিশের শিরোনাম লিখুন"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            ক্যাটাগরি
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20]"
          >
            <option value="">
              ক্যাটাগরি নির্বাচন করুন
            </option>

            {categories.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            বিস্তারিত
          </label>

          <textarea
            rows={5}
            value={details}
            onChange={(event) =>
              setDetails(event.target.value)
            }
            placeholder="নোটিশের বিস্তারিত লিখুন..."
            className="w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            PDF সংযুক্ত করুন
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-5 py-8 text-center transition hover:border-[#1b5e20] hover:bg-gray-50">
            <FileUp
              size={28}
              className="mb-2 text-gray-400"
            />

            {pdf ? (
              <>
                <span className="text-sm font-medium text-[#1b5e20]">
                  {pdf.name}
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  {(pdf.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : editingNotice?.pdfName ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  {editingNotice.pdfName}
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  নতুন PDF দিতে চাইলে click করুন
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-700">
                  PDF নির্বাচন করুন
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  সর্বোচ্চ 10 MB
                </span>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={closeForm}
            disabled={saving}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            বাতিল
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#1b5e20] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#145218] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "সংরক্ষণ হচ্ছে..."
              : editingNotice
                ? "পরিবর্তন সংরক্ষণ করুন"
                : "নোটিশ প্রকাশ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}