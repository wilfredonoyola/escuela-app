export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const paginate = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> => ({
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  },
});
