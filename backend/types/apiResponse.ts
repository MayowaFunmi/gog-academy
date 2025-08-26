export type StatusType =
  | "success"
  | "error"
  | "conflict"
  | "validation_error"
  | "notFound"
  | "unauthorized"
  | "bad_request";

export interface ApiResponse<T = unknown> {
  status: StatusType;
  message: string;
  data?: T | null;
}

export interface PaginationMeta {
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}