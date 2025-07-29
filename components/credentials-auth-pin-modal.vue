<template>
  <u-modal :default-open="true" :fullscreen="true" :dismissable="false">
    <template #content>
      <div class="flex items-center h-screen justify-center">
        <u-card v-if="!lupaPin" class="px-2 shadow relative overflow-visible">
          <div class="absolute -bottom-9 left-0 w-full flex justify-center">
            <NuxtLink href="/tasks" class="text-sm hover:underline">
              Back to Tasks
            </NuxtLink>
          </div>
          <div class="flex items-center flex-col gap-5">
            <div class="flex flex-col gap-2 items-center">
              <h1 class="text-xl font-semibold">Page Locked</h1>
              <Icon name="lucide:lock" size="50" class="text-destructive" />

              <h1 class="text-muted-foreground">Enter your credential PIN</h1>
            </div>

            <u-pin-input type="number" :v-model="pin" />

            <div class="inline-flex gap-3">
              <u-button label="Submit" @click="handleSubmit" />

              <u-button
                label="Forgot PIN"
                @click="lupaPin = true"
                variant="outline"
              />
            </div>
          </div>
        </u-card>

        <u-card v-if="lupaPin" class="px-2 shadow relative overflow-visible">
          <div class="flex flex-col items-center gap-4">
            <h1 class="font-semibold">Please Contact Administrator</h1>

            <div class="inline-flex gap-1 items-center">
              <Icon name="ic:round-whatsapp" size="20" class="text-success" />

              <h1>089643144013</h1>
            </div>

            <u-button @click="lupaPin = false" label="Back" variant="outline" />
          </div>
        </u-card>
      </div>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/auth";

const authStore = useMyAuthStore();
const toast = useToast();

const lupaPin = ref(false);

const pin = ref("");

function handleSubmit() {
  if (pin.value.length < 5) {
    toast.add({
      title: "Pin Tidak Valid!",
      description: `Minimal 5 Karakter.`,
      icon: "lucide:triangle-alert",
      color: "error",
    });
  }

  toast.add({
    title: "Pin Tidak Valid!",
    description: `Pin Anda Salah.`,
    icon: "lucide:x",
    color: "error",
  });
}
</script>
