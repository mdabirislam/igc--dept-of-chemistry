"use client";

import { useState } from "react";

import NoticeForm, {
  NoticeData,
} from "@/components/admin/notices/NoticeForm";

import NoticeTable from "@/components/admin/notices/NoticeTable";

const initialNotices: NoticeData[] = [
  {
    id: 1,
    title: "রসায়ন বিভাগের ক্লাস রুটিন সংক্রান্ত নোটিশ",
    category: "একাডেমিক",
    details:
      "রসায়ন বিভাগের নতুন ক্লাস রুটিন সংক্রান্ত বিজ্ঞপ্তি।",
    date: "০৩ সেপ্টেম্বর ২০২৬",
    time: "১০:৩০ AM",
    pdfName: "class-routine.pdf",
  },
  {
    id: 2,
    title: "পরীক্ষার ফরম পূরণ সংক্রান্ত বিজ্ঞপ্তি",
    category: "পরীক্ষা",
    details:
      "পরীক্ষার ফরম পূরণের সময়সূচি ও প্রয়োজনীয় নির্দেশনা।",
    date: "০১ সেপ্টেম্বর ২০২৬",
    time: "০৯:১৫ AM",
    pdfName: "exam-form.pdf",
  },
  {
    id: 3,
    title: "বিভাগীয় সেমিনার সংক্রান্ত নোটিশ",
    category: "ইভেন্ট",
    details:
      "বিভাগীয় সেমিনারের সময় ও স্থান সংক্রান্ত বিজ্ঞপ্তি।",
    date: "২৮ আগস্ট ২০২৬",
    time: "০২:৪৫ PM",
    pdfName: "seminar.pdf",
  },
];

export default function AdminNoticesPage() {
  const [notices, setNotices] =
    useState<NoticeData[]>(initialNotices);

  const [editingNotice, setEditingNotice] =
    useState<NoticeData | null>(null);

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

  function handleDelete(id: number) {
    setNotices((current) =>
      current.filter((item) => item.id !== id)
    );
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

      <NoticeTable
        notices={notices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}