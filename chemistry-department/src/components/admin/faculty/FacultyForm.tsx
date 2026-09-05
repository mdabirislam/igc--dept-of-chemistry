"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";

export interface FacultyData {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  imageName?: string;
  imageUrl?: string;
}

interface FacultyFormProps {
  editingFaculty?: FacultyData | null;
  onSave?: (faculty: FacultyData) => void;
  onCancelEdit?: () => void;
}

export default function FacultyForm({
  editingFaculty,
  onSave,
  onCancelEdit,
}: FacultyFormProps) {
  const [open, setOpen] = useState(Boolean(editingFaculty));
  const [name, setName] = useState(editingFaculty?.name ?? "");
  const [designation, setDesignation] = useState(
    editingFaculty?.designation ?? ""
  );
  const [qualification, setQualification] = useState(
    editingFaculty?.qualification ?? ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFaculty) {
      setOpen(true);
      setName(editingFaculty.name);
      setDesignation(editingFaculty.designation);
      setQualification(editingFaculty.qualification);
      setImage(null);
    }
  }, [editingFaculty]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("শুধুমাত্র image file নির্বাচন করুন।");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("ছবির size সর্বোচ্চ 5 MB হতে হবে।");
      return;
    }

    setError("");
    setImage(file);
  }

  function closeForm() {
    setOpen(false);
    setName("");
    setDesignation("");
    setQualification("");
    setImage(null);
    setError("");
    onCancelEdit?.();

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("শিক্ষকের নাম লিখুন।");
      return;
    }

    if (!designation.trim()) {
      setError("পদবি লিখুন।");
      return;
    }

    if (!qualification.trim()) {
      setError("শিক্ষাগত যোগ্যতা লিখুন।");
      return;
    }

    setSaving(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 400));

    const faculty: FacultyData = {
      id: editingFaculty?.id ?? Date.now(),
      name: name.trim(),
      designation: designation.trim(),
      qualification: qualification.trim(),
      imageName: image?.name ?? editingFaculty?.imageName,
      imageUrl: image
        ? URL.createObjectURL(image)
        : editingFaculty?.imageUrl,
    };

    onSave?.(faculty);

    setSaving(false);
    closeForm();
  }

  if (!open && !editingFaculty) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#145218]"
      >
        <Plus size={17} />
        নতুন শিক্ষক যোগ করুন
      </button>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="font-semibold text-gray-800">
            {editingFaculty
              ? "শিক্ষকের তথ্য সম্পাদনা"
              : "নতুন শিক্ষক যোগ করুন"}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            শিক্ষক ও কর্মকর্তার তথ্য এবং ছবি সংযুক্ত করুন
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

      <form onSubmit={submit} className="max-w-3xl space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            নাম
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="শিক্ষকের নাম"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            পদবি
          </label>

          <input
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="যেমন: সহকারী অধ্যাপক"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            শিক্ষাগত যোগ্যতা
          </label>

          <input
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="যেমন: M.Sc. in Chemistry"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            ছবি
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-5 py-8 text-center hover:border-[#1b5e20] hover:bg-gray-50">
            <ImagePlus size={28} className="mb-2 text-gray-400" />

            <span className="text-sm font-medium text-gray-700">
              {image?.name ??
                editingFaculty?.imageName ??
                "ছবি নির্বাচন করুন"}
            </span>

            <span className="mt-1 text-xs text-gray-400">
              সর্বোচ্চ 5 MB
            </span>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
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
              : editingFaculty
                ? "পরিবর্তন সংরক্ষণ করুন"
                : "শিক্ষক সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}