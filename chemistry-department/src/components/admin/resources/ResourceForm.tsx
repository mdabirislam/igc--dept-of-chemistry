"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FileUp, Plus, X } from "lucide-react";

export interface ResourceData {
  id: number;
  title: string;
  type: string;
  fileName?: string;
  fileUrl?: string;
}

interface ResourceFormProps {
  editingResource?: ResourceData | null;
  onSave?: (resource: ResourceData) => void;
  onCancelEdit?: () => void;
}

export default function ResourceForm({
  editingResource,
  onSave,
  onCancelEdit,
}: ResourceFormProps) {
  const [open, setOpen] = useState(Boolean(editingResource));
  const [title, setTitle] = useState(editingResource?.title ?? "");
  const [type, setType] = useState(editingResource?.type ?? "নোট");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingResource) {
      setOpen(true);
      setTitle(editingResource.title);
      setType(editingResource.type);
      setFile(null);
    }
  }, [editingResource]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (selected.size > 20 * 1024 * 1024) {
      setError("ফাইলের size সর্বোচ্চ 20 MB হতে হবে।");
      return;
    }

    setError("");
    setFile(selected);
  }

  function closeForm() {
    setOpen(false);
    setTitle("");
    setType("নোট");
    setFile(null);
    setError("");
    onCancelEdit?.();

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("রিসোর্সের নাম লিখুন।");
      return;
    }

    setSaving(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 400));

    const resource: ResourceData = {
      id: editingResource?.id ?? Date.now(),
      title: title.trim(),
      type,
      fileName:
        file?.name ?? editingResource?.fileName,
      fileUrl: file
        ? URL.createObjectURL(file)
        : editingResource?.fileUrl,
    };

    onSave?.(resource);

    setSaving(false);
    closeForm();
  }

  if (!open && !editingResource) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#145218]"
      >
        <Plus size={17} />
        নতুন রিসোর্স যোগ করুন
      </button>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="font-semibold text-gray-800">
            {editingResource
              ? "রিসোর্স সম্পাদনা"
              : "নতুন রিসোর্স যোগ করুন"}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            শিক্ষার্থীদের জন্য প্রয়োজনীয় resource প্রকাশ করুন
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
            রিসোর্সের নাম
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="রিসোর্সের নাম"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            ধরন
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
          >
            <option>নোট</option>
            <option>প্রশ্নপত্র</option>
            <option>ল্যাব ম্যানুয়াল</option>
            <option>ডাউনলোড</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            ফাইল
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-5 py-8 text-center hover:border-[#1b5e20] hover:bg-gray-50">
            <FileUp size={28} className="mb-2 text-gray-400" />

            <span className="text-sm font-medium text-gray-700">
              {file?.name ??
                editingResource?.fileName ??
                "ফাইল নির্বাচন করুন"}
            </span>

            <span className="mt-1 text-xs text-gray-400">
              সর্বোচ্চ 20 MB
            </span>

            <input
              ref={fileRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
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
            className="rounded-lg bg-[#1b5e20] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving
              ? "সংরক্ষণ হচ্ছে..."
              : editingResource
                ? "পরিবর্তন সংরক্ষণ করুন"
                : "রিসোর্স প্রকাশ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}