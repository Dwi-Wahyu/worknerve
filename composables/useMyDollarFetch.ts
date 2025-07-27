import type { UseFetchOptions } from "#app";
import { useMyAuthStore } from "~/store/auth";

export function useMyDollarFetch<T>(url: string, options?: UseFetchOptions<T>) {
  const authStore = useMyAuthStore();

  return $fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
}
