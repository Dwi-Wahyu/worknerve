<template>
  <div class="flex items-center justify-center">
    <u-card class="w-2xl">
      <h1 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Tambah Task Baru
      </h1>

      <u-form
        :state="state"
        :schema="createTaskSchema"
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
            icon="i-heroicons-plus-circle"
            size="lg"
            :loading="loading"
            :disabled="loading"
          >
            Tambahkan Task
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
  type CreateTaskSchemaType,
  type Status,
  type Urgency,
} from "~/schema/task";
import { useMyAuthStore } from "~/store/auth";

const toast = useToast();
const loading = ref(false);

const authStore = useMyAuthStore();

const urgencyOptions = [
  { label: "Kritis", value: "CRITICAL" },
  { label: "Tinggi", value: "HIGH" },
  { label: "Sedang", value: "MEDIUM" },
  { label: "Rendah", value: "LOW" },
];

const state = ref({
  title: "",
  description: undefined,
  urgency: "MEDIUM" as Urgency,
  status: "PENDING" as Status,
});

async function onSubmit(event: FormSubmitEvent<CreateTaskSchemaType>) {
  loading.value = true;
  try {
    const response = await $fetch("/api/tasks", {
      method: "POST",
      body: {
        title: event.data.title,
        description: event.data.description || null,
        urgency: event.data.urgency,
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    toast.add({
      title: "Task Berhasil Ditambahkan!",
      description: `Task telah berhasil dibuat.`,
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    navigateTo("/tasks");
  } catch (err: any) {
    console.error("Gagal menambahkan tugas:", err);
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
