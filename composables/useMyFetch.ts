import type { UseFetchOptions } from "nuxt/app";
import { useMyAuthStore } from "~/store/auth";

export function useMyFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  const authStore = useMyAuthStore();

  return useFetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
}
