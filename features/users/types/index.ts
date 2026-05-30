import { Role } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  success: true;
  data: User[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface UpdateUserRequest {
  role?: Role;
  isActive?: boolean;
}

export interface InviteUserRequest {
  email: string;
  name: string;
  role: Role;
}
