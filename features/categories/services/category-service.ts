import { ApiResponse, Category, CreateCategoryInput, UpdateCategoryInput } from '../types';

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    const response = await fetch('/api/categories');
    return response.json();
  },

  async getById(id: string): Promise<ApiResponse<Category>> {
    const response = await fetch(`/api/categories/${id}`);
    return response.json();
  },

  async create(data: CreateCategoryInput): Promise<ApiResponse<Category>> {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async update(id: string, data: UpdateCategoryInput): Promise<ApiResponse<Category>> {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
