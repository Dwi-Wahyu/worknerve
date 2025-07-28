<script setup lang="ts">
import LoadingSpinner from "~/components/widgets/loading-spinner.vue";
import type { CredentialType } from "~/schema/credentials";
import { useMyFetch } from "~/composables/useMyFetch";

type ColumnKey = keyof CredentialType;

type Columns = { accessorKey: ColumnKey; header: string };

const columns: Columns[] = [
  { accessorKey: "title", header: "Judul" },
  { accessorKey: "key", header: "Key" },
  { accessorKey: "value", header: "Value" },
  { accessorKey: "description", header: "Deskripsi" },
];

const {
  data: credentials,
  pending: loading,
  error,
  refresh,
} = useMyFetch<CredentialType[]>("/api/credentials");
</script>

<template>
  <u-card>
    <template #header>
      <div class="flex justify-between items-center w-full">
        <div>
          <h1 class="text-2xl font-bold">Credentials Management</h1>
          <p class="text-muted-foreground text-sm">
            Manage and securely store access credentials for your servers,
            services, and applications.
          </p>
        </div>

        <div>
          <u-button
            href="/credentials/create"
            icon="i-heroicons-plus"
            label="Input Credentials"
          />
        </div>
      </div>
    </template>

    <template #default>
      <LoadingSpinner v-if="loading" label="Loading credentials..." />
      <div v-else-if="error" class="text-red-500 py-8 text-center">
        <p>{{ error }}</p>
        <u-button
          @click="() => refresh()"
          class="mt-4"
          icon="i-heroicons-arrow-path"
        >
          Try Again
        </u-button>
      </div>
      <div v-else-if="!credentials" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          Belum ada kredensial yang ditambahkan.
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          Klik "Input Credentials" untuk menambah yang baru.
        </p>
      </div>

      <div v-else class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th
                scope="col"
                v-for="(col, idx) in columns"
                :key="idx"
                class="px-6 py-3"
              >
                {{ col.header }}
              </th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              v-for="(row, idRow) in credentials"
              :key="idRow"
            >
              <td
                v-for="(col, idCol) in columns"
                :key="idCol"
                class="px-6 py-4"
              >
                {{ row[col["accessorKey"]] ?? "-" }}
              </td>
              <td>
                <u-button
                  icon="lucide:square-pen"
                  class="mr-2"
                  variant="outline"
                />
                <u-button
                  icon="lucide:trash-2"
                  variant="outline"
                  color="error"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </u-card>
</template>
