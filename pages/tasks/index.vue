<template>
  <div
    class="flex flex-col md:flex-row gap-4 justify-between mb-6 items-center"
  >
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
      Daftar Task
    </h1>

    <div>
      <u-dropdown-menu
        :items="items"
        :content="{ align: 'center' }"
        class="mr-3"
      >
        <u-button
          label="Urgensi"
          color="neutral"
          variant="outline"
          icon="lucide:siren"
        />
      </u-dropdown-menu>

      <u-button
        @click="navigateTo('/tasks/create')"
        icon="lucide-plus"
        label="Input Task"
      />
    </div>
  </div>

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

  <div
    v-else-if="tasksByUrgency && Object.keys(tasksByUrgency).length"
    class="grid grid-cols-1 gap-6"
  >
    <u-card
      v-for="(tasks, urgency) in tasksByUrgency"
      :key="urgency"
      class="flex flex-col h-full"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h2
            class="text-xl font-semibold"
            :class="getUrgencyColorClass(urgency)"
          >
            {{ formatUrgency(urgency) }}
          </h2>
          <u-badge
            :label="tasks.length.toString()"
            :color="getUrgencyColorBadge(urgency)"
            size="lg"
            variant="soft"
          />
        </div>
      </template>

      <div class="space-y-4 grow grid grid-cols-1 md:grid-cols-2 gap-5">
        <template v-for="task in tasks" :key="task.id">
          <widgets-task-card :task="task" :refresh="refresh" />
        </template>
        <p
          v-if="tasks.length === 0"
          class="text-gray-500 dark:text-gray-400 col-span-2 text-center py-4"
        >
          Tidak ada task di kategori ini.
        </p>
      </div>
    </u-card>
  </div>

  <u-alert
    v-else
    icon="i-heroicons-clipboard-document-list"
    color="info"
    variant="soft"
    title="Belum Ada Tugas"
    description="Belum ada tugas yang tersedia. Anda bisa menambahkan tugas baru nanti!"
    class="mb-6"
  />
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed } from "vue";
import { useMyFetch } from "~/composables/useMyFetch";
import {
  formatUrgency,
  getUrgencyColorBadge,
  getUrgencyColorClass,
} from "~/helper/task-helper";
import type { Task, Urgency } from "~/schema/task";

definePageMeta({
  middleware: "auth",
});

const {
  data: tasks,
  pending,
  error,
  refresh,
} = useMyFetch<Task[]>("/api/tasks", {
  lazy: true,
});

const showKritisTask = ref(true);
const showTinggiTask = ref(true);
const showSedangTask = ref(true);
const showRendahTask = ref(true);

const tasksByUrgency = computed(() => {
  const grouped: Record<Urgency, Task[]> = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
  };

  if (tasks.value) {
    tasks.value.forEach((task) => {
      if (
        (task.urgency === "CRITICAL" && showKritisTask.value) ||
        (task.urgency === "HIGH" && showTinggiTask.value) ||
        (task.urgency === "MEDIUM" && showSedangTask.value) ||
        (task.urgency === "LOW" && showRendahTask.value)
      ) {
        if (grouped[task.urgency]) {
          grouped[task.urgency].push(task);
        }
      }
    });
  }

  return grouped;
});

const items = computed(
  () =>
    [
      {
        label: "Kritis",
        type: "checkbox" as const,
        checked: showKritisTask.value,
        onUpdateChecked(checked: boolean) {
          showKritisTask.value = checked;
        },
        onSelect(e: Event) {
          e.preventDefault();
        },
      },
      {
        label: "Tinggi",
        type: "checkbox" as const,
        checked: showTinggiTask.value,
        onUpdateChecked(checked: boolean) {
          showTinggiTask.value = checked;
        },
      },
      {
        label: "Sedang",
        type: "checkbox" as const,
        checked: showSedangTask.value,
        onUpdateChecked(checked: boolean) {
          showSedangTask.value = checked;
        },
      },
      {
        label: "Rendah",
        type: "checkbox" as const,
        checked: showRendahTask.value,
        onUpdateChecked(checked: boolean) {
          showRendahTask.value = checked;
        },
      },
    ] satisfies DropdownMenuItem[]
);
</script>

<style scoped>
/* Adjust scrollbar for task list within cards */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5); /* gray-400 with opacity */
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5); /* gray-700 with opacity */
}
</style>
