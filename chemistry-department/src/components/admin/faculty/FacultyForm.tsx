"use client";

import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";

import { apiPost, apiPut } from "@/lib/api";
import type { Faculty } from "@/types/api";

import Field, { inputClass } from "@/components/admin/ui/Field";
import ImagePicker from "@/components/admin/ui/ImagePicker";

export interface FacultyData {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  phdSubject: string;
  phdTitle: string;
  description: string;
  email: string;
  phone: string;
  order: number;
  imageName?: string;
  imageUrl?: string;
}

interface FacultyFormProps {
  editingFaculty?: FacultyData | null;
  onSave?: (faculty: FacultyData) => void;
  onCancelEdit?: () => void;
}

export function mapFacultyToFacultyData(
  faculty: Faculty
): FacultyData {
  return {
    id: faculty.id,
    name: faculty.name,
    designation: faculty.designation,
    qualification: faculty.qualification,
    phdSubject: faculty.phd_subject ?? "",
    phdTitle: faculty.phd_title ?? "",
    description: faculty.description ?? "",
    email: faculty.email ?? "",
    phone: faculty.phone ?? "",
    order: faculty.order ?? 0,
    imageName: faculty.image
      ? faculty.image.split("/").pop()
      : undefined,
    imageUrl: faculty.image_url ?? undefined,
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [phdSubject, setPhdSubject] = useState(
    editingFaculty?.phdSubject ?? ""
  );
  const [phdTitle, setPhdTitle] = useState(
    editingFaculty?.phdTitle ?? ""
  );
  const [description, setDescription] = useState(
    editingFaculty?.description ?? ""
  );
  const [email, setEmail] = useState(editingFaculty?.email ?? "");
  const [phone, setPhone] = useState(editingFaculty?.phone ?? "");
  const [order, setOrder] = useState(
    String(editingFaculty?.order ?? 0)
  );
  const [image, setImage] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setName("");
    setDesignation("");
    setQualification("");
    setPhdSubject("");
    setPhdTitle("");
    setDescription("");
    setEmail("");
    setPhone("");
    setOrder("0");
    setImage(null);
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

    if (!name.trim()) {
      setError("শিক্ষকের নাম লিখুন।");
      return;
    }

    if (!designation.trim()) {
      setError("পদবি লিখুন।");
      return;
    }

    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setError("সঠিক email address লিখুন।");
      return;
    }

    const orderNumber = Number(order);

    if (
      !Number.isInteger(orderNumber) ||
      orderNumber < 0
    ) {
      setError("ক্রম (order) একটি ০ বা তার বেশি পূর্ণ সংখ্যা হতে হবে।");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("designation", designation.trim());
      formData.append("qualification", qualification.trim());
      formData.append("phd_subject", phdSubject.trim());
      formData.append("phd_title", phdTitle.trim());
      formData.append("description", description.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("order", String(orderNumber));

      if (image) {
        formData.append("image", image);
      }

      const saved = editingFaculty
        ? await apiPut<Faculty>(
            `/faculty/${editingFaculty.id}/`,
            formData
          )
        : await apiPost<Faculty>("/faculty/", formData);

      onSave?.(mapFacultyToFacultyData(saved));

      resetForm();
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "শিক্ষকের তথ্য সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
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

      <form onSubmit={submit} className="space-y-6">
        {/* Basic */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#1b5e20]">
            মৌলিক তথ্য
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="নাম">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="শিক্ষকের নাম"
                className={inputClass}
              />
            </Field>

            <Field label="পদবি">
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="যেমন: সহকারী অধ্যাপক"
                className={inputClass}
              />
            </Field>

            <Field
              label="শিক্ষাগত যোগ্যতা"
              className="md:col-span-2"
            >
              <input
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="যেমন: M.Sc. in Chemistry"
                className={inputClass}
              />
            </Field>

            <Field
              label="ক্রম (order)"
              hint="ছোট সংখ্যা আগে দেখাবে। যেমন বিভাগীয় প্রধান = 0, তারপর 1, 2..."
            >
              <input
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* PhD */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#1b5e20]">
            PhD / গবেষণা (ঐচ্ছিক)
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="PhD-র বিষয়">
              <input
                value={phdSubject}
                onChange={(e) => setPhdSubject(e.target.value)}
                placeholder="যেমন: Organic Chemistry"
                className={inputClass}
              />
            </Field>

            <Field label="গবেষণার শিরোনাম">
              <input
                value={phdTitle}
                onChange={(e) => setPhdTitle(e.target.value)}
                placeholder="থিসিস / গবেষণার শিরোনাম"
                className={inputClass}
              />
            </Field>

            <Field
              label="বিস্তারিত পরিচিতি"
              className="md:col-span-2"
            >
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="শিক্ষক সম্পর্কে বিস্তারিত..."
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#1b5e20]">
            যোগাযোগ (ঐচ্ছিক)
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
              />
            </Field>

            <Field label="মোবাইল নম্বর">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Photo */}
        <Field label="ছবি">
          <ImagePicker
            file={image}
            existingUrl={editingFaculty?.imageUrl}
            onChange={setImage}
            onError={setError}
          />
        </Field>

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
