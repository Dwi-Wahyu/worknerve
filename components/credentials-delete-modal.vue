<template>
  <u-modal>
    <u-button icon="lucide:trash-2" variant="outline" color="error" />

    <template #header>
      <h1 class="text-xl font-semibold">Confirmation</h1>
    </template>

    <template #body>
      <div class="flex flex-col gap-2 p-5">
        <h1>
          Are you sure you want to delete the credential "{{
            credential.title
          }}"? This action cannot be undone
        </h1>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="inline-flex w-full justify-end gap-2 mt-3">
        <u-button
          label="Cancel"
          variant="outline"
          color="neutral"
          @click="close"
        />
        <u-button
          label="Yes, Delete"
          color="error"
          :disabled="isDeleting"
          @click="handleDelete"
          :loading="isDeleting"
        />
      </div>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import type { CredentialType } from "~/schema/credentials";
import { useMyAuthStore } from "~/store/auth";

const isDeleting = ref(false);
const isOpenDeleteModal = ref(false);
const toast = useToast();

const props = defineProps<{
  credential: CredentialType;
  refresh: () => void;
}>();

const authStore = useMyAuthStore();

const deleteLoading = ref(false);

async function handleDelete() {
  deleteLoading.value = true;

  const response = await $fetch("/api/credentials", {
    method: "DELETE",
    query: {
      id: props.credential.id,
    },
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });

  if (response.success) {
    toast.add({
      title: "Credentials deleted successfully!",
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    props.refresh();
  }

  deleteLoading.value = false;

  isOpenDeleteModal.value = false;
}
</script>
