"use client";

import { useEffect, useState } from "react";

import {
  apiDelete,
  apiFetch,
} from "@/lib/api";

import type { ApiNotice } from "@/types/api";

import NoticeForm, {
  mapApiNoticeToNoticeData,
  NoticeData,
} from "@/components/admin/notices/NoticeForm";

import NoticeTable from "@/components/admin/notices/NoticeTable";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [editingNotice, setEditingNotice] =
    useState<NoticeData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotices() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch<ApiNotice[]>(
        "/notices/"
      );

      setNotices(data.map(mapApiNoticeToNoticeData));
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

  useEffect(() => {
    loadNotices();
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

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "এই নোটিশটি মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    try {
      await apiDelete(`/notices/${id}/`);

      setNotices((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "নোটিশ মুছে ফেলা যায়নি।"
      );
    }
  }

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

        {!editingNotice && (
          <NoticeForm onSave={handleSave} />
        )}
      </div>

      {editingNotice && (
        <NoticeForm
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
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}