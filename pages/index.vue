<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { loginSchema, type LoginSchemaType } from "~/schema/auth";
import { useMyAuthStore } from "~/store/auth";

definePageMeta({
  layout: "login",
});

const loading = ref(false);

const authStore = useMyAuthStore();

const state = reactive({
  email: undefined,
  password: undefined,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<LoginSchemaType>) {
  loading.value = true;

  try {
    const res = await $fetch("/api/login", {
      method: "POST",
      body: {
        email: event.data.email,
        password: event.data.password,
      },
    });

    if (res.success) {
      toast.add({
        title: "Login Successful",
        description: "You have successfully signed in to the system.",
        color: "success",
      });

      authStore.user = res.user;
      authStore.token = res.token;

      navigateTo("/tasks");
    } else {
      toast.add({
        title: "Login Failed",
        description: "Incorrect username or password. Please try again.",
        color: "error",
      });
    }
  } catch (err) {
    toast.add({
      title: "Login Failed",
      description: "A server error occurred. Please try again later.",
      color: "error",
    });

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

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(val: boolean) {
    colorMode.preference = val ? "dark" : "light";
  },
});

const toggleColorMode = () => {
  isDark.value = !isDark.value;
};

onMounted(() => {
  if (!authStore.isTokenExpired) {
    navigateTo("/dashboard");
  }
});
</script>

<template>
  <div
    class="flex items-center p-5 md:p-0 h-screen bg-background relative justify-start md:justify-evenly flex-col md:flex-row"
  >
    <icons-login class="w-40 md:w-96 h-auto mb-10 mt-5 md:mt-0 md:mb-0" />

    <u-button
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="primary"
      variant="ghost"
      aria-label="Toggle Color Mode"
      @click="toggleColorMode"
      class="-my-1 right-5 top-5 md:right-10 md:top-10 absolute"
    />

    <h1 class="absolute bottom-5 text-xs text-center text-muted-foreground">
      Copyright @ Dwi Wahyu Ilahi Angka
    </h1>

    <u-card class="max-w-xl p-6 space-y-4 shadow">
      <div class="flex gap-2 mb-3 items-center">
        <img src="/favicon.svg" width="50" height="50" color="white" />

        <div>
          <h1 class="text-xl font-bold text-primary">WorkNerve</h1>
          <p class="text-sm">Your Personal Working Assistant</p>
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

        <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
          <u-button type="submit" block color="primary" :loading="loading">
            Login
          </u-button>
          <u-button
            type="button"
            block
            color="primary"
            variant="outline"
            @click="navigateTo('/register')"
          >
            Register
          </u-button>
        </div>
      </u-form>
    </u-card>
  </div>
</template>
