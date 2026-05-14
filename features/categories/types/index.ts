export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    articles: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
