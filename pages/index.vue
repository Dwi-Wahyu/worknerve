<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { loginSchema, type LoginSchemaType } from "~/schema/login";
import { useMyAuthStore } from "~/store/auth";

definePageMeta({
  layout: "login",
});

const message = ref("");
const loading = ref(false);

const authStore = useMyAuthStore();

const state = reactive({
  email: undefined,
  password: undefined,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<LoginSchemaType>) {
  loading.value = true;

  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });

  try {
    const res = await $fetch("/api/login", {
      method: "POST",
      body: {
        email: event.data.email,
        password: event.data.password,
      },
    });

    if (res.success) {
      message.value = "Login berhasil!";

      console.log(res.token);

      authStore.user = res.user;
      authStore.token = res.token;

      navigateTo("/tasks");
    } else {
      message.value = "Login gagal. Coba lagi.";
    }
  } catch (err) {
    message.value = "Terjadi kesalahan server.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id);
    element?.focus();
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

onMounted(() => {
  console.log(authStore.isTokenExpired);

  if (!authStore.isTokenExpired) {
    navigateTo("/tasks");
  }
});
</script>

<template>
  <div
    class="flex items-center p-5 md:p-0 h-screen justify-start md:justify-evenly flex-col md:flex-row"
  >
    <icons-login class="w-40 md:w-96 h-auto mb-10 mt-5 md:mt-0 md:mb-0" />

    <u-card class="max-w-xl p-6 space-y-4">
      <div class="flex gap-2 mb-3 items-center">
        <img src="/favicon.svg" width="52" height="52" color="white" />

        <div>
          <h1 class="text-2xl font-bold text-primary">WorkNerve</h1>
          <p class="mt-1">Your Personal Working Assistant</p>
        </div>
      </div>

      <u-form
        :schema="loginSchema"
        :state="state"
        class="space-y-4 pt-2"
        @submit="onSubmit"
        @error="onError"
      >
        <u-form-field label="Email" name="email">
          <u-input
            class="w-full"
            v-model="state.email"
            placeholder="email@example.com"
          />
        </u-form-field>

        <u-form-field label="Password" name="password">
          <widgets-password-input
            v-model="state.password"
            placeholder="Minimal 8 karakter"
            input-class="w-full"
          />
        </u-form-field>

        <u-button type="submit" block color="primary" :loading="loading"
          >Login</u-button
        >
      </u-form>
    </u-card>
  </div>
</template>
