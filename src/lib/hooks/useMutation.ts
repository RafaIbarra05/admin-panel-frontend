"use client";

import * as React from "react";

type MutateFn<TData, TVars> = (vars: TVars) => Promise<TData>;

export function useMutation<TData = unknown, TVars = void>(
  fn: MutateFn<TData, TVars>,
) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const mutate = React.useCallback(
    async (vars: TVars) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fn(vars);
        return { data, error: null as string | null };
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error";
        setError(message);
        return { data: null as TData | null, error: message };
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { mutate, loading, error, setError };
}
