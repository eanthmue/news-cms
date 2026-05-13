import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Mock next/navigation specifically for this test to control the router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('LoginForm', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as unknown as ReturnType<typeof useRouter>);
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates input fields on change', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits form and redirects on success', async () => {
    vi.mocked(signIn).mockResolvedValue({ error: null, ok: true, status: 200, url: '' });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('shows error message on failed submission', async () => {
    vi.mocked(signIn).mockResolvedValue({ error: 'Invalid credentials', ok: false, status: 401, url: '' });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows loading state during submission', async () => {
    // Mock signIn to be slow
    vi.mocked(signIn).mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ error: null, ok: true, status: 200, url: '' }), 100)));

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Logging in...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
});
