"use client";

import {
  Edit3,
  Image as ImageIcon,
  Trash2,
  Users,
} from "lucide-react";

import type { FacultyData } from "./FacultyForm";
import Image from "next/image";

interface FacultyTableProps {
  faculty: FacultyData[];
  onEdit: (faculty: FacultyData) => void;
  onDelete: (person: FacultyData) => void;
}

export default function FacultyTable({
  faculty,
  onEdit,
  onDelete,
}: FacultyTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-gray-800">
            <Users size={18} className="text-[#1b5e20]" />
            শিক্ষকবৃন্দ
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            বিভাগে যুক্ত সকল শিক্ষক ও কর্মকর্তার তালিকা
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#1b5e20]">
          {faculty.length} জন
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs text-gray-500">
              <th className="px-5 py-3 font-semibold">শিক্ষক</th>
              <th className="px-5 py-3 font-semibold">পদবি</th>
              <th className="px-5 py-3 font-semibold">
                শিক্ষাগত যোগ্যতা
              </th>
              <th className="px-5 py-3 font-semibold">ক্রম</th>
              <th className="px-5 py-3 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {faculty.map((person) => (
              <tr
                key={person.id}
                className="border-b last:border-0 hover:bg-gray-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                      {person.imageUrl ? (
                        <Image
                          src={person.imageUrl}
                          alt={person.name}
                          width={48}
                          height={48}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Users
                            size={22}
                            className="text-gray-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-800">
                        {person.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-400">
                        {[person.phone, person.email]
                          .filter(Boolean)
                          .join(" · ") || "যোগাযোগের তথ্য নেই"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-[#1b5e20]">
                    {person.designation}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  <p>{person.qualification || "—"}</p>

                  {person.phdSubject && (
                    <p className="mt-1 text-xs text-gray-400">
                      PhD: {person.phdSubject}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {person.order}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEdit(person)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1b5e20]"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDelete(person)}
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

      {faculty.length === 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <ImageIcon size={32} className="text-gray-300" />

          <p className="mt-3 text-sm font-medium text-gray-600">
            কোনো শিক্ষক পাওয়া যায়নি
          </p>
        </div>
      )}
    </section>
  );
}