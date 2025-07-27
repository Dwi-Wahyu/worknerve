<template>
  <u-modal v-model="isOpen">
    <u-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Detail Tugas
          </h3>
          <u-button
            color="primary"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>

      <div v-if="loading" class="flex flex-col items-center justify-center p-8">
        <widgets-loading-spinner title="Memuat detail tugas..." />
      </div>

      <u-alert
        v-else-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="soft"
        title="Gagal Memuat Detail"
        :description="
          error.message || 'Terjadi kesalahan saat mengambil detail tugas.'
        "
        class="my-4"
      />

      <div v-else-if="task" class="p-4 space-y-6">
        <div>
          <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ task.title }}
          </h4>
          <p
            v-if="task.description"
            class="text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {{ task.description }}
          </p>
          <p v-else class="text-gray-500 italic">Tidak ada deskripsi.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div>
              <u-icon
                name="i-heroicons-exclamation-circle"
                class="text-primary-500"
              />
            </div>
            <div>
              <span class="font-medium">Urgensi:</span>
              <u-badge
                :label="formatUrgency(task.urgency)"
                :color="getUrgencyColorBadge(task.urgency)"
                size="lg"
                class="ml-2"
              />
            </div>
          </div>

          <div>
            <div>
              <u-icon name="i-heroicons-tag" class="text-orange-500" />
            </div>
            <div>
              <span class="font-medium">Status:</span>
              <u-badge
                :label="task.status"
                :color="getStatusColorBadge(task.status)"
                size="lg"
                class="ml-2"
              />
            </div>
          </div>

          <div>
            <div>
              <u-icon name="i-heroicons-calendar" class="text-blue-500" />
            </div>
            <div>
              <span class="font-medium">Dibuat:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{
                formatDate(task.createdAt)
              }}</span>
            </div>
          </div>

          <div>
            <div>
              <u-icon name="i-heroicons-arrow-path" class="text-teal-500" />
            </div>
            <div>
              <span class="font-medium">Terakhir Diperbarui:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{
                formatDate(task.updatedAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="p-4 text-center text-gray-500">
        Detail tugas tidak ditemukan.
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <u-button
            color="neutral"
            variant="outline"
            icon="i-heroicons-pencil-square"
            label="Edit Tugas"
            :to="`/tasks/${task?.id}`"
            @click="isOpen = false"
            v-if="task"
          />
          <u-button
            color="error"
            variant="solid"
            icon="i-heroicons-trash"
            label="Hapus Tugas"
            @click="deleteTask"
            v-if="task"
          />
        </div>
      </template>
    </u-card>
  </u-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  getStatusColorBadge,
  getUrgencyColorBadge,
} from "~/helper/task-helper";
import type { Task, Urgency } from "~/schema/task";

const props = defineProps<{
  taskId: number | null;
}>();

const emit = defineEmits(["close", "taskDeleted"]);

const isOpen = ref(false);
const task = ref<Task | null>(null);
const loading = ref(false);
const error = ref<Error | null>(null);
const toast = useToast();

watch(
  () => props.taskId,
  (newId) => {
    if (newId) {
      fetchTaskDetail(newId);
      isOpen.value = true;
    } else {
      isOpen.value = false;
      task.value = null;
    }
  },
  { immediate: true }
);

watch(isOpen, (newVal) => {
  if (!newVal) {
    emit("close");
  }
});

const fetchTaskDetail = async (id: number) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await $fetch<{ success: boolean; task: Task | null }>(
      `/api/tasks/${id}`
    );
    if (response.success && response.task) {
      task.value = response.task;
    } else {
      task.value = null;
      error.value = new Error("Tugas tidak ditemukan.");
    }
  } catch (err: any) {
    console.error("Error fetching task detail:", err);
    error.value = new Error(err.data?.message || "Gagal memuat detail tugas.");
    task.value = null;
  } finally {
    loading.value = false;
  }
};

const deleteTask = async () => {
  if (!task.value?.id) return;

  if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
    try {
      loading.value = true;
      await $fetch(`/api/tasks/${task.value.id}`, {
        method: "DELETE",
      });
      toast.add({
        title: "Tugas Berhasil Dihapus!",
        description: `Tugas "${task.value.title}" telah dihapus.`,
        icon: "i-heroicons-trash",
        color: "success",
      });
      isOpen.value = false;
      emit("taskDeleted");
    } catch (err: any) {
      console.error("Gagal menghapus tugas:", err);
      toast.add({
        title: "Gagal Menghapus Tugas",
        description:
          err.data?.message || "Terjadi kesalahan saat menghapus tugas.",
        icon: "i-heroicons-exclamation-triangle",
        color: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

const formatUrgency = (urgency: Urgency) => {
  switch (urgency) {
    case "CRITICAL":
      return "Kritis";
    case "HIGH":
      return "Tinggi";
    case "MEDIUM":
      return "Sedang";
    case "LOW":
      return "Rendah";
    default:
      return urgency;
  }
};

const formatDate = (dateString: Date) => {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};
</script>
