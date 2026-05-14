"use client";

import { useState, useEffect, useCallback } from "react";
import { Category } from "../types";
import { categoryService } from "../services/category-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Plus } from "lucide-react";
import { CategoryDialog } from "./CategoryDialog";
import { CategoryForm } from "./CategoryForm";

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await categoryService.delete(id);
      if (res.success) {
        fetchCategories();
      } else {
        alert(res.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("An unexpected error occurred");
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = editingCategory
        ? await categoryService.update(editingCategory.id, data)
        : await categoryService.create(data);

      if (res.success) {
        setIsDialogOpen(false);
        fetchCategories();
      } else {
        alert(res.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Failed to save category", error);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No categories found</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">{category.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category._count?.articles || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.displayOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-600 hover:text-red-900" 
                      onClick={() => handleDelete(category.id)}
                      disabled={category._count?.articles ? category._count.articles > 0 : false}
                      title={category._count?.articles && category._count.articles > 0 ? "Cannot delete category with articles" : "Delete category"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingCategory ? "Edit Category" : "Create Category"}
      >
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogOpen(false)}
          isLoading={isSubmitting}
        />
      </CategoryDialog>
    </div>
  );
}
