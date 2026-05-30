import { NextResponse } from "next/server";
import { z } from "zod";

type PaginationMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

type ApiErrorOptions = {
  code: ApiErrorCode;
  message: string;
  status: number;
  fieldErrors?: Record<string, string[]>;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: PaginationMeta;
};

export type ApiFailure = {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};

export function apiSuccess<T>(
  data: T,
  init?: ResponseInit & { meta?: PaginationMeta }
) {
  const { meta, ...responseInit } = init ?? {};
  const body: ApiSuccess<T> = meta
    ? { success: true, data, meta }
    : { success: true, data };

  return NextResponse.json(body, responseInit);
}

export function apiError(options: ApiErrorOptions) {
  const { status, code, message, fieldErrors } = options;
  const body: ApiFailure = {
    success: false,
    error: fieldErrors
      ? { code, message, fieldErrors }
      : { code, message },
  };

  return NextResponse.json(body, { status });
}

export function apiValidationError(error: z.ZodError) {
  return apiError({
    code: "VALIDATION_ERROR",
    message: "Invalid request.",
    status: 400,
    fieldErrors: z.flattenError(error).fieldErrors,
  });
}

export const apiErrors = {
  badRequest(message: string) {
    return apiError({ code: "BAD_REQUEST", message, status: 400 });
  },
  unauthenticated(message = "Authentication is required.") {
    return apiError({ code: "UNAUTHENTICATED", message, status: 401 });
  },
  forbidden(message = "You do not have permission to perform this action.") {
    return apiError({ code: "FORBIDDEN", message, status: 403 });
  },
  notFound(message: string) {
    return apiError({ code: "NOT_FOUND", message, status: 404 });
  },
  conflict(message: string) {
    return apiError({ code: "CONFLICT", message, status: 409 });
  },
  internal(message = "An unexpected error occurred.") {
    return apiError({
      code: "INTERNAL_SERVER_ERROR",
      message,
      status: 500,
    });
  },
};
