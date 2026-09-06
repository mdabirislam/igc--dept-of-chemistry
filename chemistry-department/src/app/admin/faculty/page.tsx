"use client";

import { useEffect, useState } from "react";

import {
  apiDelete,
  apiFetch,
} from "@/lib/api";

import type { ApiFaculty } from "@/types/api";

import FacultyForm, {
  FacultyData,
  mapApiFacultyToFacultyData,
} from "@/components/admin/faculty/FacultyForm";

import FacultyTable from "@/components/admin/faculty/FacultyTable";

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<FacultyData[]>([]);
  const [editingFaculty, setEditingFaculty] =
    useState<FacultyData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFaculty() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch<ApiFaculty[]>(
        "/faculty/"
      );

      setFaculty(data.map(mapApiFacultyToFacultyData));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "শিক্ষকের তথ্য লোড করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFaculty();
  }, []);

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

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "এই শিক্ষককে মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    try {
      await apiDelete(`/faculty/${id}/`);

      setFaculty((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "শিক্ষকের তথ্য মুছে ফেলা যায়নি।"
      );
    }
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

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
          শিক্ষক তালিকা লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <FacultyTable
          faculty={faculty}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}