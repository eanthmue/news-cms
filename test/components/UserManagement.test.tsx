import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import { UserTable } from '@/features/users/components/UserTable';
import { InviteUserDialog } from '@/features/users/components/InviteUserDialog';
import { Role } from '@prisma/client';

// Mock fetch
const globalFetch = vi.fn();
vi.stubGlobal('fetch', globalFetch);

// Mock window.confirm
vi.stubGlobal('confirm', vi.fn(() => true));
// Mock window.alert
vi.stubGlobal('alert', vi.fn());

describe('User Management Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UserTable', () => {
    const mockUsers = [
      {
        id: '1',
        email: 'user1@example.com',
        name: 'User One',
        role: Role.EDITOR,
        isActive: true,
        lastLoginAt: null,
      },
    ];

    it('should fetch and display users', async () => {
      globalFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockUsers, meta: { total: 1 } }),
      });

      render(<UserTable />);

      expect(screen.getByText(/Loading.../i)).toBeDefined();

      await waitFor(() => {
        expect(screen.getByText('User One')).toBeDefined();
        expect(screen.getByText('user1@example.com')).toBeDefined();
        expect(screen.getByText('EDITOR')).toBeDefined();
        expect(screen.getByText('Active')).toBeDefined();
      });
    });

    it('should toggle user status', async () => {
      globalFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockUsers, meta: { total: 1 } }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: mockUsers[0] }) });

      render(<UserTable />);

      await waitFor(() => screen.getByText('Active'));

      fireEvent.click(screen.getByText('Active'));

      await waitFor(() => {
        expect(globalFetch).toHaveBeenCalledWith(
          '/api/users/1',
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ isActive: false }),
          })
        );
      });
    });

    it('should delete user after confirmation', async () => {
      globalFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockUsers, meta: { total: 1 } }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: null }) });

      render(<UserTable />);

      await waitFor(() => screen.getByTitle('Delete User'));

      fireEvent.click(screen.getByTitle('Delete User'));

      await waitFor(() => {
        expect(globalFetch).toHaveBeenCalledWith(
          '/api/users/1',
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });
  });

  describe('InviteUserDialog', () => {
    it('should open dialog and submit invitation', async () => {
      const onSuccess = vi.fn();
      globalFetch.mockResolvedValueOnce({ ok: true });

      render(<InviteUserDialog onSuccess={onSuccess} />);

      fireEvent.click(screen.getByText('Invite New User'));

      expect(screen.getByText('Invite New User', { selector: 'h2' })).toBeDefined();

      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'New User' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'new@example.com' } });
      fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: Role.SUPER_ADMIN } });

      fireEvent.click(screen.getByText('Send Invitation'));

      await waitFor(() => {
        expect(globalFetch).toHaveBeenCalledWith(
          '/api/auth/invite',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ email: 'new@example.com', name: 'New User', role: Role.SUPER_ADMIN }),
          })
        );
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });
});
