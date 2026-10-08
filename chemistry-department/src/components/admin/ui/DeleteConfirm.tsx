"use client";

import { useEffect } from "react";
import { Loader2, Trash2, X } from "lucide-react";

type DeleteConfirmProps = {
  open: boolean;
  title?: string;
  description?: string;
  error?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirm({
  open,
  title = "তথ্য মুছে ফেলবেন?",
  description = "এই কাজটি আর undo করা যাবে না।",
  error = "",
  loading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmProps) {
  useEffect(() => {
    if (!open || loading) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={loading ? undefined : onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-description"
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b p-5">
          <div className="min-w-0">
            <h2
              id="delete-confirm-title"
              className="text-lg font-semibold text-gray-800"
            >
              {title}
            </h2>

            <p
              id="delete-confirm-description"
              className="mt-1 break-words text-sm text-gray-500"
            >
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="বন্ধ করুন"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-5 mt-5 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 p-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            autoFocus
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            বাতিল
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}

            {loading ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
          </button>
        </div>
      </div>
    </div>
  );
}
