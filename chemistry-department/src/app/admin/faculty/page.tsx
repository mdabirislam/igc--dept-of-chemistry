"use client";

import { useState } from "react";

import FacultyForm, {
  FacultyData,
} from "@/components/admin/faculty/FacultyForm";

import FacultyTable from "@/components/admin/faculty/FacultyTable";

const initialFaculty: FacultyData[] = [
  {
    id: 1,
    name: "অধ্যাপক —",
    designation: "বিভাগীয় প্রধান",
    qualification: "M.Sc. in Chemistry",
    imageUrl: "/images/faculty/faculty-01.jpg",
  },
  {
    id: 2,
    name: "সহযোগী অধ্যাপক —",
    designation: "সহযোগী অধ্যাপক",
    qualification: "M.Sc. in Chemistry",
    imageUrl: "/images/faculty/faculty-02.jpg",
  },
  {
    id: 3,
    name: "সহকারী অধ্যাপক —",
    designation: "সহকারী অধ্যাপক",
    qualification: "M.Sc. in Chemistry",
    imageUrl: "/images/faculty/faculty-03.jpg",
  },
  {
    id: 4,
    name: "প্রভাষক —",
    designation: "প্রভাষক",
    qualification: "M.Sc. in Chemistry",
    imageUrl: "/images/faculty/faculty-04.jpg",
  },
  {
    id: 5,
    name: "প্রভাষক —",
    designation: "প্রভাষক",
    qualification: "M.Sc. in Chemistry",
    imageUrl: "/images/faculty/faculty-05.jpg",
  },
];

export default function AdminFacultyPage() {
  const [faculty, setFaculty] =
    useState<FacultyData[]>(initialFaculty);

  const [editingFaculty, setEditingFaculty] =
    useState<FacultyData | null>(null);

  function handleSave(person: FacultyData) {
    setFaculty((current) => {
      const exists = current.some(
        (item) => item.id === person.id
      );

      if (exists) {
        return current.map((item) =>
          item.id === person.id ? person : item
        );
      }

      return [person, ...current];
    });

    setEditingFaculty(null);
  }

  function handleDelete(id: number) {
    setFaculty((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function handleEdit(person: FacultyData) {
    setEditingFaculty(person);

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
            শিক্ষক ব্যবস্থাপনা
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            শিক্ষক ও কর্মকর্তাদের তথ্য পরিচালনা করুন।
          </p>
        </div>

        {!editingFaculty && (
          <FacultyForm onSave={handleSave} />
        )}
      </div>

      {editingFaculty && (
        <FacultyForm
          editingFaculty={editingFaculty}
          onSave={handleSave}
          onCancelEdit={() => setEditingFaculty(null)}
        />
      )}

      <FacultyTable
        faculty={faculty}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}