import { useMyAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useMyAuthStore();

  if (authStore.isTokenExpired) {
    return navigateTo("/");
  }
});
