"use client";

import {
  Download,
  Edit3,
  FileText,
  Trash2,
} from "lucide-react";

import type { ResourceData } from "./ResourceForm";

interface ResourceTableProps {
  resources: ResourceData[];
  onEdit: (resource: ResourceData) => void;
  onDelete: (id: number) => void;
}

export default function ResourceTable({
  resources,
  onEdit,
  onDelete,
}: ResourceTableProps) {
  function deleteResource(resource: ResourceData) {
    const confirmed = window.confirm(
      `"${resource.title}" মুছে ফেলতে চান?`
    );

    if (confirmed) {
      onDelete(resource.id);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold text-gray-800">
            প্রকাশিত রিসোর্স
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            শিক্ষার্থীদের জন্য প্রকাশিত resource
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#1b5e20]">
          {resources.length} টি
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs text-gray-500">
              <th className="px-5 py-3 font-semibold">
                রিসোর্স
              </th>

              <th className="px-5 py-3 font-semibold">
                ধরন
              </th>

              <th className="px-5 py-3 font-semibold">
                File
              </th>

              <th className="px-5 py-3 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => (
              <tr
                key={resource.id}
                className="border-b last:border-0 hover:bg-gray-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-[#1b5e20]">
                      <FileText size={17} />
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        {resource.title}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                    {resource.type}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {resource.fileUrl ? (
                    <a
                      href={resource.fileUrl}
                      download={resource.fileName}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1b5e20] hover:underline"
                    >
                      <Download size={15} />
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">
                      কোনো file নেই
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEdit(resource)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1b5e20]"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => deleteResource(resource)}
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

      {resources.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          কোনো রিসোর্স প্রকাশ করা হয়নি।
        </div>
      )}
    </section>
  );
}