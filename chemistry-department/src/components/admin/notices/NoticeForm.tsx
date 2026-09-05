"use client";

import { FormEvent, useRef, useState } from "react";
import { FileUp, Plus, X } from "lucide-react";

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

export default function NoticeForm({
  editingNotice,
  onSave,
  onCancelEdit,
}: NoticeFormProps) {
  const [open, setOpen] = useState(Boolean(editingNotice));

  const [title, setTitle] = useState(
    editingNotice?.title ?? ""
  );

  const [category, setCategory] = useState(
    editingNotice?.category ?? ""
  );

  const [details, setDetails] = useState(
    editingNotice?.details ?? ""
  );

  const [pdf, setPdf] = useState<File | null>(null);

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("শুধুমাত্র PDF file নির্বাচন করুন।");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("PDF file-এর size সর্বোচ্চ 10 MB হতে হবে।");
      return;
    }

    setError("");
    setPdf(file);
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDetails("");
    setPdf(null);
    setError("");
    setSaving(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeForm = () => {
    resetForm();
    setOpen(false);
    onCancelEdit?.();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("নোটিশের শিরোনাম লিখুন।");
      return;
    }

    if (!category) {
      setError("ক্যাটাগরি নির্বাচন করুন।");
      return;
    }

    if (!details.trim()) {
      setError("নোটিশের বিস্তারিত লিখুন।");
      return;
    }

    setSaving(true);
    setError("");

    // Frontend prototype save simulation
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    const now = new Date();

    const notice: NoticeData = {
      id: editingNotice?.id ?? Date.now(),
      title: title.trim(),
      category,
      details: details.trim(),

      date: now.toLocaleDateString("bn-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),

      time: now.toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
      }),

      pdfName:
        pdf?.name ?? editingNotice?.pdfName,

      pdfUrl:
        pdf
          ? URL.createObjectURL(pdf)
          : editingNotice?.pdfUrl,
    };

    onSave?.(notice);

    resetForm();
    setOpen(false);
  };

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
          aria-label="বন্ধ করুন"
        >
          <X size={18} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Title */}
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

        {/* Category */}
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

            <option value="একাডেমিক">
              একাডেমিক
            </option>

            <option value="পরীক্ষা">
              পরীক্ষা
            </option>

            <option value="ভর্তি">
              ভর্তি
            </option>

            <option value="সাধারণ">
              সাধারণ
            </option>

            <option value="ইভেন্ট">
              ইভেন্ট
            </option>
          </select>
        </div>

        {/* Details */}
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

        {/* PDF */}
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

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}
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