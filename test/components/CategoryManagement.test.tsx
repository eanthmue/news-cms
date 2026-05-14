import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryList } from '@/features/categories/components/CategoryList';
import { categoryService } from '@/features/categories/services/category-service';

// Mock categoryService
vi.mock('@/features/categories/services/category-service', () => ({
  categoryService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Category Management', () => {
  const mockCategories = [
    {
      id: '1',
      name: 'Technology',
      slug: 'technology',
      displayOrder: 1,
      isActive: true,
      _count: { articles: 0 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(categoryService.getAll).mockResolvedValue({
      success: true,
      data: mockCategories,
    });
    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true));
    // Mock window.alert
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders the category list', async () => {
    render(<CategoryList />);

    expect(screen.getByText('Loading...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeDefined();
      expect(screen.getByText('technology')).toBeDefined();
    });
  });

  it('opens the create dialog when clicking Add Category', async () => {
    render(<CategoryList />);
    
    await waitFor(() => screen.getByText('Technology'));

    const addButton = screen.getByText('Add Category');
    fireEvent.click(addButton);

    expect(screen.getByRole('heading', { name: 'Create Category' })).toBeDefined();
    expect(screen.getByLabelText('Name')).toBeDefined();
  });

  it('auto-generates slug when typing name in create form', async () => {
    render(<CategoryList />);
    
    await waitFor(() => screen.getByText('Technology'));
    fireEvent.click(screen.getByText('Add Category'));

    const nameInput = screen.getByLabelText('Name');
    const slugInput = screen.getByLabelText('Slug');

    fireEvent.change(nameInput, { target: { value: 'New Test Category' } });

    expect(slugInput.value).toBe('new-test-category');
  });

  it('submits the form to create a new category', async () => {
    vi.mocked(categoryService.create).mockResolvedValue({
      success: true,
      data: { id: '2', name: 'New Cat', slug: 'new-cat', displayOrder: 0, isActive: true },
    });

    render(<CategoryList />);
    
    await waitFor(() => screen.getByText('Technology'));
    fireEvent.click(screen.getByText('Add Category'));

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Cat' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Category' }));

    await waitFor(() => {
      expect(categoryService.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Cat',
        slug: 'new-cat',
      }));
    });
  });

  it('calls delete service when delete button is clicked', async () => {
    vi.mocked(categoryService.delete).mockResolvedValue({ success: true });

    render(<CategoryList />);
    
    await waitFor(() => screen.getByText('Technology'));

    const deleteButtons = screen.getAllByRole('button');
    // The second button in the actions cell is Delete
    const deleteButton = deleteButtons.find(b => b.title === 'Delete category');
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(categoryService.delete).toHaveBeenCalledWith('1');
    });
  });
});
