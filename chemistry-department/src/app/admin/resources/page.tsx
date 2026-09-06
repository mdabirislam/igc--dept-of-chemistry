"use client";

import { useEffect, useState } from "react";

import {
  apiDelete,
  apiFetch,
} from "@/lib/api";

import type { ApiResource } from "@/types/api";

import ResourceForm, {
  ResourceData,
  mapApiResourceToResourceData,
} from "@/components/admin/resources/ResourceForm";

import ResourceTable from "@/components/admin/resources/ResourceTable";

export default function AdminResourcesPage() {
  const [resources, setResources] =
    useState<ResourceData[]>([]);

  const [editingResource, setEditingResource] =
    useState<ResourceData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadResources() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch<ApiResource[]>(
        "/resources/"
      );

      setResources(
        data.map(mapApiResourceToResourceData)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "রিসোর্স লোড করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  function handleSave(resource: ResourceData) {
    setResources((current) => {
      const exists = current.some(
        (item) => item.id === resource.id
      );

      if (exists) {
        return current.map((item) =>
          item.id === resource.id ? resource : item
        );
      }

      return [resource, ...current];
    });

    setEditingResource(null);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "এই রিসোর্সটি মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    try {
      await apiDelete(`/resources/${id}/`);

      setResources((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "রিসোর্স মুছে ফেলা যায়নি।"
      );
    }
  }

  function handleEdit(resource: ResourceData) {
    setEditingResource(resource);

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
            রিসোর্স ব্যবস্থাপনা
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            শিক্ষার্থীদের জন্য প্রয়োজনীয় learning resources
            প্রকাশ করুন।
          </p>
        </div>

        {!editingResource && (
          <ResourceForm onSave={handleSave} />
        )}
      </div>

      {editingResource && (
        <ResourceForm
          editingResource={editingResource}
          onSave={handleSave}
          onCancelEdit={() => setEditingResource(null)}
        />
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
          রিসোর্স লোড হচ্ছে...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <ResourceTable
          resources={resources}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}