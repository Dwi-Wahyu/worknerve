<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { useMyAuthStore } from "~/store/auth";

const colorMode = useColorMode();

const authStore = useMyAuthStore();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(val: boolean) {
    colorMode.preference = val ? "dark" : "light";
  },
});

const toggleColorMode = () => {
  isDark.value = !isDark.value;
};

function handleLogout() {
  authStore.token = "";
  authStore.user = null;
  navigateTo("/");
}

const navigationItems = ref<NavigationMenuItem[]>([
  {
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    to: "/dashboard",
  },
  {
    label: "Task",
    icon: "lucide:notebook",
    to: "/tasks",
  },
  {
    label: "Credentials",
    icon: "tabler:lock-password",
    to: "/credentials",
  },
  {
    label: "Port Mapping",
    icon: "lucide-server",
    to: "/port-mapping",
  },
]);

const dropdownItems = ref<DropdownMenuItem[]>([
  {
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    onSelect() {
      navigateTo("/dashboard");
    },
  },
  {
    label: "Task",
    icon: "lucide:notebook",
    onSelect() {
      navigateTo("/tasks");
    },
  },
  {
    label: "Credentials",
    icon: "tabler:lock-password",
    onSelect() {
      navigateTo("/credentials");
    },
  },
  {
    label: "Port Mapping",
    icon: "lucide-server",
    onSelect() {
      navigateTo("/port-mapping");
    },
  },
]);
</script>

<template>
  <div class="w-full bg-white dark:bg-accent shadow py-3">
    <u-container class="w-full justify-between flex items-center">
      <div class="flex gap-2 items-center">
        <img src="/favicon.svg" width="25" height="25" alt="" />
        <h1 class="text-lg font-semibold">WorkNerve</h1>
      </div>

      <u-navigation-menu class="hidden md:block" :items="navigationItems" />

      <div class="flex items-center gap-3">
        <u-dropdown-menu
          :items="dropdownItems"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
          }"
          class="block md:hidden"
          :ui="{
            content: 'w-48',
          }"
        >
          <u-button
            icon="charm:menu-hamburger"
            color="primary"
            variant="ghost"
            aria-label="Toggle Menu"
            class="pb-1"
          />
        </u-dropdown-menu>

        <div>
          <u-button
            icon="lucide:log-out"
            variant="ghost"
            class="mr-2"
            @click="handleLogout"
          />

          <u-button
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            color="primary"
            variant="ghost"
            aria-label="Toggle Color Mode"
            @click="toggleColorMode"
            class="-my-1"
          />
        </div>
      </div>
    </u-container>
  </div>
</template>
