<script setup lang="ts">
import LoadingSpinner from "~/components/widgets/loading-spinner.vue";
import type { CredentialType } from "~/schema/credentials";
import { useMyFetch } from "~/composables/useMyFetch";

type ColumnKey = keyof CredentialType;

type Columns = { accessorKey: ColumnKey; header: string };

const columns: Columns[] = [
  { accessorKey: "id", header: "#ID" },
  { accessorKey: "key", header: "Key" },
  { accessorKey: "value", header: "Value" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "serverId", header: "Server ID" },
  { accessorKey: "applicationId", header: "Application ID" },
];

const {
  data: credentials,
  pending: loading,
  error,
  refresh,
} = useMyFetch<CredentialType[]>("/api/credentials");
</script>

<template>
  <u-container class="py-8">
    <u-card>
      <template #header>
        <div class="flex justify-between items-center w-full">
          <div>
            <h1 class="text-2xl font-bold">Credentials Page</h1>
            <p class="text-gray-600 dark:text-gray-300">
              Ini adalah halaman Credentials.
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
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </u-card>
  </u-container>
</template>
