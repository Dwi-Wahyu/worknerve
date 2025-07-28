<template>
  <div class="flex items-center justify-center">
    <u-card class="w-2xl">
      <h1 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Edit Task
      </h1>

      <div v-if="pending" class="flex justify-center items-center h-64">
        <u-icon name="i-lucide-loader" class="size-5 animate-spin" />
        <p class="ml-3 text-lg text-gray-600 dark:text-gray-300">
          Loading Task ...
        </p>
      </div>

      <u-alert
        v-else-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="soft"
        title="Gagal Memuat Tugas"
        :description="
          error.message ||
          'Terjadi kesalahan saat mengambil data tugas. Silakan coba lagi nanti.'
        "
        class="mb-6"
      />

      <u-form
        v-else
        :state="state"
        :schema="updateTaskSchema"
        class="space-y-6"
        @submit="onSubmit"
      >
        <u-form-field label="Judul Task" name="title" required>
          <u-input
            v-model="state.title"
            placeholder="Misal: Buat laporan keuangan Q3"
            class="w-full"
          />
        </u-form-field>

        <u-form-field label="Deskripsi (Opsional)" name="description">
          <u-textarea
            v-model="state.description"
            placeholder="Detail lebih lanjut tentang tugas..."
            class="w-full"
            :rows="5"
          />
        </u-form-field>

        <u-form-field label="Status" name="status">
          <u-select
            v-model="state.status"
            :items="taskStatusOptions"
            class="w-full"
            placeholder="Pilih status"
          />
        </u-form-field>

        <u-form-field label="Urgensi" name="urgency" required>
          <u-select
            v-model="state.urgency"
            :items="urgencyOptions"
            class="w-full"
            placeholder="Pilih tingkat urgensi"
          />
        </u-form-field>

        <div class="flex justify-center gap-4">
          <u-button
            type="button"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-uturn-left"
            size="lg"
            @click="navigateTo('/tasks')"
          >
            Batal
          </u-button>
          <u-button
            type="submit"
            icon="lucide:save"
            size="lg"
            :loading="loading"
            :disabled="loading"
          >
            SImpan
          </u-button>
        </div>
      </u-form>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref } from "vue";
import { taskStatusOptions } from "~/constant/task-status";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskSchemaType,
  type Status,
  type Task,
  type UpdateTaskSchemaType,
  type Urgency,
} from "~/schema/task";
import { useMyAuthStore } from "~/store/auth";

const toast = useToast();
const loading = ref(false);

const route = useRoute();
const { id } = route.params;

const authStore = useMyAuthStore();

const state = ref({
  title: "",
  description: undefined,
  urgency: "MEDIUM" as Urgency,
  status: "PENDING" as Status,
  id: "",
});

const { pending, error } = await useMyFetch<Task>("/api/tasks/" + id, {
  onResponse: ({ response }) => {
    state.value = {
      title: response._data.title,
      description: response._data.description,
      urgency: response._data.urgency,
      status: response._data.status,
      id: response._data.id,
    };
  },
  lazy: true,
});

const urgencyOptions = [
  { label: "Kritis", value: "CRITICAL" },
  { label: "Tinggi", value: "HIGH" },
  { label: "Sedang", value: "MEDIUM" },
  { label: "Rendah", value: "LOW" },
];

async function onSubmit(event: FormSubmitEvent<UpdateTaskSchemaType>) {
  loading.value = true;
  try {
    const response = await $fetch("/api/tasks", {
      method: "patch",
      body: {
        title: event.data.title,
        description: event.data.description || null,
        urgency: event.data.urgency,
        status: event.data.status,
        id: event.data.id,
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    toast.add({
      title: "Task Berhasil Disimpan!",
      description: `Perubahan telah diterapkan`,
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    navigateTo("/tasks");
  } catch (err: any) {
    console.error("Gagal menyimpan tugas:", err);
    toast.add({
      title: "Gagal Menambahkan Task",
      description:
        err.data?.message ||
        "Terjadi kesalahan saat menyimpan tugas. Silakan coba lagi.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
