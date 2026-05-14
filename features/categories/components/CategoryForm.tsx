"use client";

import { useState } from "react";
import { CreateCategoryInput, UpdateCategoryInput, Category } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ initialData, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    displayOrder: initialData?.displayOrder || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [isSlugManual, setIsSlugManual] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    if (name === "slug") {
      setIsSlugManual(true);
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: val };
      
      // Auto-generate slug if it's a new category and slug hasn't been manually edited, 
      // or if name is changed and slug is empty
      if (name === "name" && !initialData && (!isSlugManual || newData.slug === "")) {
        newData.slug = slugify(value);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Category Name"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          placeholder="category-slug"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700">
          Display Order
        </label>
        <Input
          id="displayOrder"
          name="displayOrder"
          type="number"
          value={formData.displayOrder}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
