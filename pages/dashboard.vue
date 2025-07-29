<template>
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Welcome, {{ authStore.user?.name }}!
    </h1>
    <p class="text-gray-600 text-sm dark:text-gray-300">
      Ready to be more productive today? Here’s a quick overview of your tasks.
    </p>
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    <u-card
      class="transform transition-transform duration-200 hover:scale-105 space-y-3 shadow-md"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <u-avatar icon="i-heroicons-clipboard-document-list" size="lg" />
          <h3 class="text-xl font-semibold">Total Tasks</h3>
        </div>
      </template>
      <p class="text-5xl font-bold text-gray-800 dark:text-gray-100 mt-4">
        {{ tasks?.length ?? 0 }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Active tasks in the system.
      </p>
    </u-card>

    <u-card
      class="transform transition-transform space-y-3 duration-200 hover:scale-105 shadow-md"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <u-avatar icon="i-heroicons-tag" size="lg" />
          <h3 class="text-xl font-semibold">Task Status</h3>
        </div>
      </template>
      <div class="space-y-2">
        <div
          v-for="(count, status) in taskStatusSummary"
          :key="status"
          class="flex justify-between items-center text-gray-700 dark:text-gray-200"
        >
          <span class="capitalize font-medium">{{ status }}</span>
          <u-badge :label="count" size="md" variant="soft" />
        </div>
      </div>
    </u-card>

    <u-card
      class="transform space-y-3 transition-transform duration-200 hover:scale-105 shadow-md"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <u-avatar icon="i-heroicons-exclamation-circle" size="lg" />
          <h3 class="text-xl font-semibold">Task Urgency</h3>
        </div>
      </template>
      <div class="space-y-2">
        <div
          v-for="(count, urgency) in taskUrgencySummary"
          :key="urgency"
          class="flex justify-between items-center text-gray-700 dark:text-gray-200"
        >
          <span class="capitalize font-medium">{{ urgency }}</span>
          <u-badge :label="count" size="md" variant="subtle" />
        </div>
      </div>
    </u-card>

    <u-card
      class="transform space-y-3 transition-transform duration-200 hover:scale-105 shadow-md"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <u-avatar icon="i-heroicons-key" size="lg" />
          <h3 class="text-xl font-semibold">Total Credentials</h3>
        </div>
      </template>
      <p class="text-5xl font-bold text-gray-800 dark:text-gray-100 mt-4">
        {{ credentials?.length ?? 0 }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Total credentials stored in the system.
      </p>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { CredentialType } from "~/schema/credentials";
import type { Task } from "~/schema/task";
import { useMyAuthStore } from "~/store/auth";

definePageMeta({
  middleware: "auth",
});

const authStore = useMyAuthStore();

const { data: tasks } = await useMyFetch<Task[]>("/api/tasks");
const { data: credentials } = await useMyFetch<CredentialType[]>(
  "/api/credentials"
);

const taskStatusSummary = computed(() => {
  const summary: { [key: string]: number } = {
    PENDING: 0,
    PROGRESS: 0,
    BLOCKED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  if (!tasks.value?.length) {
    return summary;
  }

  tasks.value.forEach((task) => {
    if (summary[task.status] !== undefined) {
      summary[task.status]++;
    }
  });
  return summary;
});

const taskUrgencySummary = computed(() => {
  const summary: { [key: string]: number } = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };

  if (!tasks.value?.length) {
    return summary;
  }

  tasks.value.forEach((task) => {
    if (summary[task.urgency] !== undefined) {
      summary[task.urgency]++;
    }
  });
  return summary;
});
</script>
