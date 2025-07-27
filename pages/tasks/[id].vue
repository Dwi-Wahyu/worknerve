<template>
  <div class="flex items-center justify-center">
    <u-card v-if="pending">
      <widgets-loading-spinner />
    </u-card>

    <u-card class="w-2xl" v-if="data?.task">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Edit Tugas
      </h1>

      <u-form
        :state="state"
        :schema="schema"
        class="space-y-6"
        @submit="onSubmit"
      >
        <u-form-field label="Judul Tugas" name="title" required>
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
            :items="statusOptions"
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
            Tambahkan Tugas
          </u-button>
        </div>
      </u-form>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref } from "vue";
import { object, string, boolean, mixed, type InferType } from "yup";
import type { Status, Task, Urgency } from "~/schema/task";

const route = useRoute();
const { id } = route.params;

type InitialDataResponseType = {
  success: boolean;
  task: Task | null;
};

const state = ref({
  title: "",
  description: undefined,
  urgency: "MEDIUM" as Urgency,
  status: "PENDING" as Status,
});

const { data, pending, error } = useFetch<InitialDataResponseType>(
  "/api/tasks/" + id,
  {
    onResponse({ response }) {
      if (response._data.task) {
        state.value.title = response._data.task.title;
        state.value.description = response._data.task.description;
        state.value.urgency = response._data.task.urgency;
        state.value.status = response._data.task.status;
      }
    },
  }
);

const toast = useToast();
const loading = ref(false);

const statusOptions = ref([
  "PENDING",
  "PROGRESS",
  "BLOCKED",
  "COMPLETED",
  "CANCELLED",
]);
const urgencyOptions = ref([
  { label: "Kritis", value: "CRITICAL" },
  { label: "Tinggi", value: "HIGH" },
  { label: "Sedang", value: "MEDIUM" },
  { label: "Rendah", value: "LOW" },
]);

const schema = object({
  title: string()
    .min(3, "Judul minimal 3 karakter")
    .required("Judul tugas wajib diisi"),
  description: string().nullable().optional(),
  status: mixed<Status>()
    .oneOf(
      ["PENDING", "PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"],
      "Status tidak valid"
    )
    .default("PENDING")
    .required("Urgensi wajib dipilih"),
  urgency: mixed<Urgency>()
    .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"], "Urgensi tidak valid")
    .required("Urgensi wajib dipilih"),
});

type Schema = InferType<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const response = await $fetch("/api/tasks", {
      method: "POST",
      body: {
        title: event.data.title,
        description: event.data.description || null,
        urgency: event.data.urgency,
        userId: 1,
      },
    });

    toast.add({
      title: "Tugas Berhasil Ditambahkan!",
      description: `Tugas telah berhasil dibuat.`,
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    navigateTo("/tasks");
  } catch (err: any) {
    console.error("Gagal menambahkan tugas:", err);
    toast.add({
      title: "Gagal Menambahkan Tugas",
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
