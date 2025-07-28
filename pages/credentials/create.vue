<template>
  <div class="flex items-center justify-center">
    <u-card class="w-2xl">
      <h1 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Tambah Kredensial Baru
      </h1>

      <u-form
        :state="state"
        :schema="createCredentialSchema"
        class="space-y-6"
        @submit="onSubmit"
      >
        <u-form-field label="Title" name="title" required>
          <u-input
            v-model="state.title"
            placeholder="Misal: Stripe Api Key"
            class="w-full"
          />
        </u-form-field>

        <u-form-field label="Key" name="key" required>
          <u-input
            v-model="state.key"
            placeholder="Misal: API_KEY_STRIPE"
            class="w-full"
          />
        </u-form-field>

        <u-form-field label="Value" name="value" required>
          <u-input
            v-model="state.value"
            placeholder="Misal: sk_live_xxxxxxxxxxxxxx"
            class="w-full"
          />
        </u-form-field>

        <u-form-field label="Deskripsi" name="description">
          <u-textarea
            v-model="state.description"
            placeholder="Deskripsi singkat tentang kredensial ini..."
            class="w-full"
            :rows="3"
          />
        </u-form-field>

        <u-form-field label="Server ID (Opsional)" name="serverId">
          <u-input
            v-model="state.serverId"
            placeholder="ID Server terkait (angka)"
            class="w-full"
            type="number"
          />
        </u-form-field>

        <u-form-field label="Application ID (Opsional)" name="applicationId">
          <u-input
            v-model="state.applicationId"
            placeholder="ID Aplikasi terkait (angka)"
            class="w-full"
            type="number"
          />
        </u-form-field>

        <div class="flex justify-center gap-4">
          <u-button
            type="button"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-uturn-left"
            size="lg"
            @click="navigateTo('/credentials')"
          >
            Batal
          </u-button>
          <u-button
            type="submit"
            icon="i-heroicons-plus-circle"
            size="lg"
            :loading="loading"
            :disabled="loading"
          >
            Tambahkan Kredensial
          </u-button>
        </div>
      </u-form>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref } from "vue";
import {
  createCredentialSchema,
  type CreateCredentialPayload,
} from "~/schema/credentials";
import { useMyAuthStore } from "~/store/auth";

const toast = useToast();
const loading = ref(false);

const authStore = useMyAuthStore();

const state = reactive({
  title: "",
  key: "",
  value: "",
  description: "",
  serverId: undefined as number | undefined,
  applicationId: undefined as number | undefined,
});

async function onSubmit(event: FormSubmitEvent<CreateCredentialPayload>) {
  loading.value = true;
  try {
    const response = await $fetch("/api/credentials", {
      method: "POST",
      body: {
        title: event.data.title,
        key: event.data.key,
        value: event.data.value,
        description: event.data.description,
        serverId: event.data.serverId || null,
        applicationId: event.data.applicationId || null,
        userId: authStore.user?.id,
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    toast.add({
      title: "Kredensial Berhasil Ditambahkan!",
      description: `Kredensial telah berhasil dibuat.`,
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    navigateTo("/credentials");
  } catch (err: any) {
    console.error("Gagal menambahkan kredensial:", err);
    toast.add({
      title: "Gagal Menambahkan Kredensial",
      description:
        err.data?.message ||
        "Terjadi kesalahan saat menyimpan kredensial. Silakan coba lagi.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
