"use client";

import {
  Download,
  Edit3,
  FileText,
  Trash2,
} from "lucide-react";

import type { NoticeData } from "./NoticeForm";

interface NoticeTableProps {
  notices: NoticeData[];
  onEdit: (notice: NoticeData) => void;
  onDelete: (id: number) => void;
}

export default function NoticeTable({
  notices,
  onEdit,
  onDelete,
}: NoticeTableProps) {
  function deleteNotice(notice: NoticeData) {
    const confirmed = window.confirm(
      `"${notice.title}" মুছে ফেলতে চান?`
    );

    if (confirmed) {
      onDelete(notice.id);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="font-semibold text-gray-800">
            প্রকাশিত নোটিশ
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            বিভাগে প্রকাশিত সকল নোটিশ
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#1b5e20]">
          {notices.length} টি নোটিশ
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs text-gray-500">
              <th className="px-5 py-3 font-semibold">
                নোটিশ
              </th>

              <th className="px-5 py-3 font-semibold">
                ক্যাটাগরি
              </th>

              <th className="px-5 py-3 font-semibold">
                প্রকাশের তারিখ
              </th>

              <th className="px-5 py-3 font-semibold">
                PDF
              </th>

              <th className="px-5 py-3 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {notices.map((notice) => (
              <tr
                key={notice.id}
                className="border-b last:border-0 hover:bg-gray-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-red-50 p-2 text-red-500">
                      <FileText size={17} />
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        {notice.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {notice.time}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                    {notice.category}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {notice.date}
                </td>

                <td className="px-5 py-4">
                  {notice.pdfUrl ? (
                    <a
                      href={notice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1b5e20] hover:underline"
                    >
                      <Download size={15} />
                      PDF
                    </a>
                  ) : notice.pdfName ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                      <FileText size={15} />
                      {notice.pdfName}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      নেই
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEdit(notice)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1b5e20]"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => deleteNotice(notice)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notices.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          কোনো নোটিশ প্রকাশ করা হয়নি।
        </div>
      )}
    </section>
  );
}