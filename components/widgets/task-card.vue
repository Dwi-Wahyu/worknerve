<template>
  <u-card
    class="shadow-sm relative overflow-visible hover:shadow-lg transition-shadow duration-200 cursor-pointer"
  >
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg grow">
          {{ task.title }}
        </h3>

        <u-modal :title="task.title">
          <u-button
            icon="lucide-ellipsis"
            class="rotate-90"
            color="neutral"
            variant="ghost"
          />

          <template #body>
            <div class="p-4">
              <h1>{{ task.description }}</h1>

              <h1 class="my-3 text-muted-foreground">
                {{ formatDate(task.createdAt) }}
              </h1>

              <u-badge
                :label="task.urgency"
                :color="getUrgencyColorBadge(task.urgency)"
                size="sm"
                class="mr-2"
              />
              <u-badge
                :label="task.status"
                :color="getStatusColorBadge(task.status)"
                size="sm"
              />

              <div class="justify-end flex gap-3 mt-3">
                <u-button
                  @click="handleHapus"
                  icon="lucide-trash-2"
                  label="Hapus"
                  color="error"
                  variant="subtle"
                  :loading="deleteLoading"
                />

                <u-button
                  @click="navigateTo('/tasks/' + task.id)"
                  icon="lucide-pencil"
                  label="Edit"
                  color="warning"
                  variant="subtle"
                />
              </div>
            </div>
          </template>
        </u-modal>
      </div>

      <u-badge
        :label="task.status"
        :color="getStatusColorBadge(task.status)"
        size="sm"
        class="absolute -top-2 -left-2"
      />

      <p
        v-if="task.description"
        class="text-sm text-muted-foreground line-clamp-2"
      >
        {{ task.description }}
      </p>
      <div
        class="flex items-center justify-between text-xs text-muted-foreground"
      >
        <span>{{ formatDate(task.createdAt) }}</span>
      </div>

      <div class="flex gap-2">
        <u-button
          @click="handleChangeStatus('COMPLETED')"
          icon="lucide-check"
          class="cursor-pointer"
          color="success"
          variant="subtle"
          :loading="statusButtonLoading === 'COMPLETED'"
        />

        <u-button
          @click="handleChangeStatus('PROGRESS')"
          icon="mdi:progress-wrench"
          class="cursor-pointer"
          color="info"
          variant="subtle"
          :loading="statusButtonLoading === 'PROGRESS'"
        />

        <u-button
          @click="handleChangeStatus('CANCELLED')"
          icon="lucide-x"
          class="cursor-pointer"
          color="error"
          variant="subtle"
          :loading="statusButtonLoading === 'CANCELLED'"
        />

        <u-button
          @click="handleChangeStatus('BLOCKED')"
          icon="material-symbols:pending-actions"
          class="cursor-pointer"
          color="warning"
          variant="subtle"
          :loading="statusButtonLoading === 'BLOCKED'"
        />
      </div>
    </div>
  </u-card>
</template>

<script setup lang="ts">
import {
  getStatusColorBadge,
  getUrgencyColorBadge,
} from "~/helper/task-helper";
import type { Task } from "~/schema/task";
import { useMyAuthStore } from "~/store/auth";

const props = defineProps<{
  task: Task;
  refresh: () => void;
}>();

const authStore = useMyAuthStore();

const toast = useToast();

const open = ref(false);

const statusButtonLoading = ref("");
const deleteLoading = ref(false);

function toggleOpen() {
  open.value = !open.value;
  console.log(open.value);
}

async function handleChangeStatus(status: string) {
  statusButtonLoading.value = status;

  const response = await $fetch("/api/tasks/change-status", {
    method: "POST",
    query: {
      id: props.task.id,
      status,
    },
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });

  if (response.success) {
    toast.add({
      title: "Status Berhasil Diganti!",
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    props.refresh();
  }

  statusButtonLoading.value = "";
}

async function handleHapus() {
  deleteLoading.value = true;

  const response = await $fetch("/api/tasks/", {
    method: "DELETE",
    query: {
      id: props.task.id,
    },
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });

  if (response.success) {
    toast.add({
      title: "Task berhasil dihapus!",
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    props.refresh();
  }

  deleteLoading.value = false;
}

const formatDate = (dateString: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};
</script>
