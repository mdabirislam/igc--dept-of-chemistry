"use client";

import { useState } from "react";

import ResourceForm, {
  ResourceData,
} from "@/components/admin/resources/ResourceForm";

import ResourceTable from "@/components/admin/resources/ResourceTable";

const initialResources: ResourceData[] = [
  {
    id: 1,
    title: "Organic Chemistry Notes",
    type: "নোট",
    fileName: "organic-chemistry.pdf",
  },
  {
    id: 2,
    title: "Chemistry Practical Manual",
    type: "ল্যাব ম্যানুয়াল",
    fileName: "practical-manual.pdf",
  },
];

export default function AdminResourcesPage() {
  const [resources, setResources] =
    useState<ResourceData[]>(initialResources);

  const [editingResource, setEditingResource] =
    useState<ResourceData | null>(null);

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

  function handleDelete(id: number) {
    setResources((current) =>
      current.filter((item) => item.id !== id)
    );
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

      <ResourceTable
        resources={resources}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}