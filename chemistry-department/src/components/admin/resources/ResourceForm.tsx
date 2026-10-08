"use client";

import {
  FormEvent,
  useRef,
  useState,
} from "react";

import {
  ExternalLink,
  FileUp,
  Plus,
  X,
} from "lucide-react";

import {
  apiPost,
  apiPut,
} from "@/lib/api";

import type { Resource } from "@/types/api";

export interface ResourceData {
  id: number;
  title: string;
  resourceType: "file" | "link";
  fileName?: string;
  fileUrl?: string;
  url?: string;
}

interface ResourceFormProps {
  editingResource?: ResourceData | null;
  onSave?: (resource: ResourceData) => void;
  onCancelEdit?: () => void;
}

export function mapResourceToResourceData(
  resource: Resource
): ResourceData {
  return {
    id: resource.id,
    title: resource.title,
    resourceType: resource.resource_type,
    fileName: resource.file
      ? resource.file.split("/").pop()
      : undefined,
    fileUrl: resource.file_url ?? undefined,
    url: resource.url || undefined,
  };
}

export default function ResourceForm({
  editingResource,
  onSave,
  onCancelEdit,
}: ResourceFormProps) {
  const [open, setOpen] = useState(
    Boolean(editingResource)
  );

  const [title, setTitle] = useState(
    editingResource?.title ?? ""
  );

  const [resourceType, setResourceType] =
    useState<"file" | "link">(
      editingResource?.resourceType ?? "file"
    );

  const [file, setFile] =
    useState<File | null>(null);

  const [url, setUrl] = useState(
    editingResource?.url ?? ""
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fileRef =
    useRef<HTMLInputElement>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      setError(
        "ফাইলের size সর্বোচ্চ 10 MB হতে হবে।"
      );
      return;
    }

    setError("");
    setFile(selected);
  }

  function handleResourceTypeChange(
    type: "file" | "link"
  ) {
    setResourceType(type);
    setError("");

    if (type === "file") {
      setUrl("");
    } else {
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  }

  function resetForm() {
    setTitle("");
    setResourceType("file");
    setFile(null);
    setUrl("");
    setError("");
    setSaving(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function closeForm() {
    resetForm();
    setOpen(false);
    onCancelEdit?.();
  }

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("রিসোর্সের নাম লিখুন।");
      return;
    }

    if (resourceType === "file" && !file && !editingResource) {
      setError("একটি ফাইল নির্বাচন করুন।");
      return;
    }

    if (resourceType === "link") {
      if (!url.trim()) {
        setError("একটি URL দিন।");
        return;
      }

      try {
        new URL(url.trim());
      } catch {
        setError("সঠিক URL দিন।");
        return;
      }
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("resource_type", resourceType);

      if (resourceType === "file") {
        if (file) {
          formData.append("file", file);
        }
      } else {
        formData.append("url", url.trim());
      }

      let saved: Resource;

      if (editingResource) {
        saved = await apiPut<Resource>(
          `/resources/${editingResource.id}/`,
          formData
        );
      } else {
        saved = await apiPost<Resource>(
          "/resources/",
          formData
        );
      }

      onSave?.(
        mapResourceToResourceData(saved)
      );

      resetForm();
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "রিসোর্স সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
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
            রিসোর্সের ধরন
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                handleResourceTypeChange("file")
              }
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                resourceType === "file"
                  ? "border-[#1b5e20] bg-green-50 text-[#1b5e20]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileUp size={20} />

              <div>
                <div className="font-semibold">
                  ফাইল
                </div>

                <div className="mt-0.5 text-xs text-gray-400">
                  PDF, Word, Excel, Image, Video
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleResourceTypeChange("link")
              }
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                resourceType === "link"
                  ? "border-[#1b5e20] bg-green-50 text-[#1b5e20]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ExternalLink size={20} />

              <div>
                <div className="font-semibold">
                  External Link
                </div>

                <div className="mt-0.5 text-xs text-gray-400">
                  Facebook, YouTube, Google Drive ইত্যাদি
                </div>
              </div>
            </button>
          </div>
        </div>

        {resourceType === "file" ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              ফাইল
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-5 py-8 text-center hover:border-[#1b5e20] hover:bg-gray-50">
              <FileUp
                size={28}
                className="mb-2 text-gray-400"
              />

              <span className="text-sm font-medium text-gray-700">
                {file?.name ??
                  editingResource?.fileName ??
                  "ফাইল নির্বাচন করুন"}
              </span>

              <span className="mt-1 text-xs text-gray-400">
                PDF, Word, Excel, PowerPoint, JPG, PNG,
                WebP, MP4, WebM, MOV — সর্বোচ্চ 10 MB
              </span>

              <input
                ref={fileRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.mp4,.webm,.mov"
              />
            </label>
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              External URL
            </label>

            <div className="relative">
              <ExternalLink
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/..."
                className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#1b5e20]"
              />
            </div>

            <p className="mt-1.5 text-xs text-gray-400">
              Facebook, YouTube, Google Drive অথবা যেকোনো
              valid external URL দিতে পারবেন।
            </p>
          </div>
        )}

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