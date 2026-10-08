"use client";

import { useEffect, useState } from "react";

import {
  apiDelete,
  apiFetch,
} from "@/lib/api";

import { useDeleteConfirm } from "@/components/admin/ui/useDeleteConfirm";

import type { Notice } from "@/types/api";

import NoticeForm, {
  mapNoticeToNoticeData,
  NoticeData,
} from "@/components/admin/notices/NoticeForm";

import NoticeTable from "@/components/admin/notices/NoticeTable";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [editingNotice, setEditingNotice] =
    useState<NoticeData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotices() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch<Notice[]>(
          "/notices/"
        );

        setNotices(
          data.map(mapNoticeToNoticeData)
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "নোটিশ লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchNotices();
  }, []);

  function handleSave(notice: NoticeData) {
    setNotices((current) => {
      const exists = current.some(
        (item) => item.id === notice.id
      );

      if (exists) {
        return current.map((item) =>
          item.id === notice.id ? notice : item
        );
      }

      return [notice, ...current];
    });

    setEditingNotice(null);
  }

  const { requestDelete, dialog } = useDeleteConfirm<NoticeData>({
    onDelete: async (item) => {
      await apiDelete(`/notices/${item.id}/`);

      setNotices((current) =>
        current.filter((entry) => entry.id !== item.id)
      );
    },
    title: () => "নোটিশ মুছে ফেলবেন?",
    description: (item) =>
      `"${item.title}" স্থায়ীভাবে মুছে যাবে। এই কাজটি আর undo করা যাবে না।`,
    fallbackError: "নোটিশ মুছে ফেলা যায়নি।",
  });

  function handleEdit(notice: NoticeData) {
    setEditingNotice(notice);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-6 p-5 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            নোটিশ ব্যবস্থাপনা
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            বিভাগীয় নোটিশ প্রকাশ, সম্পাদনা ও পরিচালনা করুন।
          </p>
        </div>
      </div>

      {!editingNotice && (
        <div>
          <NoticeForm onSave={handleSave} />
        </div>
      )}

      {editingNotice && (
        <NoticeForm
          key={editingNotice.id}
          editingNotice={editingNotice}
          onSave={handleSave}
          onCancelEdit={() => setEditingNotice(null)}
        />
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
          নোটিশ লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <NoticeTable
          notices={notices}
          onEdit={handleEdit}
          onDelete={requestDelete}
        />
      )}

      {dialog}
    </div>
  );
}
