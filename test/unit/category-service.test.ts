import { describe, it, expect, vi, beforeEach } from 'vitest';
import { categoryService } from '@/features/categories/services/category-service';

describe('categoryService', () => {
  const mockCategory = {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    displayOrder: 1,
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('getAll', () => {
    it('should fetch all categories', async () => {
      const mockResponse = { success: true, data: [mockCategory] };
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => mockResponse,
      } as Response);

      const result = await categoryService.getAll();

      expect(fetch).toHaveBeenCalledWith('/api/categories');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should fetch a category by id', async () => {
      const mockResponse = { success: true, data: mockCategory };
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => mockResponse,
      } as Response);

      const result = await categoryService.getById('1');

      expect(fetch).toHaveBeenCalledWith('/api/categories/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const input = { name: 'New Cat', slug: 'new-cat' };
      const mockResponse = { success: true, data: { ...mockCategory, ...input } };
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => mockResponse,
      } as Response);

      const result = await categoryService.create(input);

      expect(fetch).toHaveBeenCalledWith('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const input = { id: '1', name: 'Updated Cat' };
      const mockResponse = { success: true, data: { ...mockCategory, ...input } };
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => mockResponse,
      } as Response);

      const result = await categoryService.update('1', input);

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const mockResponse = { success: true };
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => mockResponse,
      } as Response);

      const result = await categoryService.delete('1');

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'DELETE',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
