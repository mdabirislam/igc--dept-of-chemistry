"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";

import DeleteConfirm from "./DeleteConfirm";

interface UseDeleteConfirmOptions<T> {
  /** Deletes the item. Throw an Error to show its message in the dialog. */
  onDelete: (item: T) => Promise<void>;
  title: (item: T) => string;
  description: (item: T) => string;
  fallbackError?: string;
}

/**
 * Replaces window.confirm / alert for admin deletes.
 *
 * `requestDelete(item)` opens the confirmation dialog, and `dialog` must be
 * rendered once somewhere in the page. If the delete fails, the dialog stays
 * open and shows the error so the admin can retry or cancel.
 */
export function useDeleteConfirm<T>({
  onDelete,
  title,
  description,
  fallbackError = "মুছে ফেলা যায়নি।",
}: UseDeleteConfirmOptions<T>): {
  requestDelete: (item: T) => void;
  dialog: ReactNode;
} {
  const [pending, setPending] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestDelete = useCallback((item: T) => {
    setError("");
    setPending(item);
  }, []);

  const cancel = useCallback(() => {
    setPending(null);
    setError("");
  }, []);

  async function confirm() {
    if (pending === null) return;

    setLoading(true);
    setError("");

    try {
      await onDelete(pending);
      setPending(null);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : fallbackError
      );
    } finally {
      setLoading(false);
    }
  }

  const dialog = (
    <DeleteConfirm
      open={pending !== null}
      title={pending !== null ? title(pending) : undefined}
      description={
        pending !== null ? description(pending) : undefined
      }
      error={error}
      loading={loading}
      onCancel={cancel}
      onConfirm={() => void confirm()}
    />
  );

  return { requestDelete, dialog };
}
