"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

interface ImagePickerProps {
  file: File | null;
  existingUrl?: string | null;
  maxMB?: number;
  onChange: (file: File | null) => void;
  onError: (message: string) => void;
  /** When given, a "remove image" button is shown. */
  onRemove?: () => void;
  /** The saved image was marked for removal. */
  removed?: boolean;
  className?: string;
}

export default function ImagePicker({
  file,
  existingUrl,
  maxMB = 5,
  onChange,
  onError,
  onRemove,
  removed = false,
  className = "h-40",
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Allow picking the same file again after the form is reset.
  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const picked = event.target.files?.[0];

    if (!picked) return;

    if (!picked.type.startsWith("image/")) {
      onError("শুধুমাত্র image file নির্বাচন করুন।");
      return;
    }

    if (picked.size > maxMB * 1024 * 1024) {
      onError(`ছবির size সর্বোচ্চ ${maxMB} MB হতে হবে।`);
      return;
    }

    onError("");
    onChange(picked);
  }

  const shown = previewUrl ?? (removed ? null : existingUrl) ?? null;

  return (
    <label
      className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-center transition hover:border-[#1b5e20] ${className}`}
    >
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shown}
          alt="Preview"
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <>
          <ImagePlus size={28} className="mb-2 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            ছবি নির্বাচন করুন
          </span>
          <span className="mt-1 text-xs text-gray-400">
            সর্বোচ্চ {maxMB} MB
          </span>
        </>
      )}

      {shown && (
        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white">
          পরিবর্তন করতে click করুন
        </span>
      )}

      {shown && onRemove && (
        <button
          type="button"
          onClick={(event) => {
            // The picker is a <label>; do not open the file dialog.
            event.preventDefault();
            event.stopPropagation();
            onChange(null);
            onRemove();
          }}
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-[11px] font-medium text-white shadow hover:bg-red-700"
        >
          <Trash2 size={12} />
          ছবি মুছুন
        </button>
      )}

      {removed && !shown && (
        <span className="mt-2 text-xs text-red-500">
          সংরক্ষণ করলে ছবিটি মুছে যাবে
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
