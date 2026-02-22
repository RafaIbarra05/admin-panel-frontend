"use client";

import * as React from "react";
import type { PaginatedResponse } from "@/lib/api/types";

type Fetcher<T> = (args: {
  page: number;
  limit: number;
}) => Promise<PaginatedResponse<T>>;

type Options = {
  initialPage?: number;
  initialLimit?: number;
  enabled?: boolean; // por si querés esperar a que abra un modal, etc.
};

export function usePaginatedResource<T>(
  fetcher: Fetcher<T>,
  options: Options = {},
) {
  const { initialPage = 1, initialLimit = 10, enabled = true } = options;

  const [page, setPage] = React.useState(initialPage);
  const [limit, setLimit] = React.useState(initialLimit);

  const [data, setData] = React.useState<T[]>([]);
  const [meta, setMeta] = React.useState<PaginatedResponse<T>["meta"]>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const requestIdRef = React.useRef(0);

  const load = React.useCallback(async () => {
    if (!enabled) return;

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await fetcher({ page, limit });

      // evita race conditions (si cambiás rápido de page/limit)
      if (requestId !== requestIdRef.current) return;

      setData(res.data);
      setMeta(res.meta);
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      setError((e as Error).message ?? "Error");
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
    }
  }, [enabled, fetcher, page, limit]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const refetch = React.useCallback(() => {
    void load();
  }, [load]);

  const resetToFirstPage = React.useCallback(() => {
    setPage(1);
  }, []);

  return {
    // data
    data,
    meta,
    loading,
    error,

    // pagination
    page,
    limit,
    setPage,
    setLimit,
    totalPages: meta.totalPages,

    // actions
    refetch,
    resetToFirstPage,
  };
}
