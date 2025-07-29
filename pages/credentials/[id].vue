<template>
  <div class="flex items-center justify-center">
    <u-card class="w-2xl">
      <h1 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Edit Credential
      </h1>

      <div v-if="pending" class="flex justify-center items-center h-64">
        <u-icon name="i-lucide-loader" class="size-5 animate-spin" />
        <p class="ml-3 text-lg text-gray-600 dark:text-gray-300">
          Loading Credential ...
        </p>
      </div>

      <u-alert
        v-else-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="soft"
        title="Gagal Loading Task"
        :description="
          error.message ||
          'Terjadi kesalahan saat mengambil data tugas. Silakan coba lagi nanti.'
        "
        class="mb-6"
      />

      <u-form
        v-else
        :state="state"
        :schema="updateCredentialSchema"
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
            Tambahkan Credential
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
  updateCredentialSchema,
  type UpdateCredentialSchemaType,
} from "~/schema/credentials";
import { useMyAuthStore } from "~/store/auth";

const toast = useToast();
const loading = ref(false);

const route = useRoute();
const { id } = route.params;

const authStore = useMyAuthStore();

const state = ref({
  title: "",
  key: "",
  value: "",
  description: "",
  serverId: undefined as number | undefined,
  applicationId: undefined as number | undefined,
  id: "",
});

const { pending, error } = await useMyFetch<Credential>(
  "/api/credentials/" + id,
  {
    onResponse: ({ response }) => {
      state.value = {
        title: response._data.title,
        key: response._data.key,
        value: response._data.value,
        description: response._data.description,
        serverId: response._data.serverId,
        applicationId: response._data.applicationId,
        id: response._data.id,
      };
    },
    lazy: true,
  }
);

async function onSubmit(event: FormSubmitEvent<UpdateCredentialSchemaType>) {
  loading.value = true;
  try {
    const response = await $fetch("/api/credentials", {
      method: "PATCH",
      body: {
        title: event.data.title,
        key: event.data.key,
        value: event.data.value,
        description: event.data.description,
        serverId: event.data.serverId || null,
        applicationId: event.data.applicationId || null,
        id: event.data.id,
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.success) {
      toast.add({
        title: "Credential Saved Successfully!",
        description: "Your changes have been applied.",
        icon: "i-heroicons-check-circle",
        color: "success",
      });

      navigateTo("/credentials");
    } else {
      toast.add({
        title: "Failed to Save Credential",
        description:
          "An error occurred while saving the credential. Please try again.",
        icon: "i-heroicons-exclamation-triangle",
        color: "error",
      });
    }
  } catch (err: any) {
    console.error("Gagal menambahkan kredensial:", err);
    toast.add({
      title: "Failed to Save Credential",
      description:
        err.data?.message ||
        "An error occurred while saving the credential. Please try again.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
