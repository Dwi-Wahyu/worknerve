<template>
  <u-card
    class="flex flex-col items-center justify-center text-center p-8 gap-4 rounded-xl shadow-lg relative"
  >
    <u-modal
      v-model:open="isModalOpen"
      description="Tetapkan Target Untuk Sesi Yang Akan Anda Mulai"
      title="Atur Target Sesi"
    >
      <u-button
        icon="i-heroicons-cog-6-tooth"
        class="absolute top-4 right-4"
        variant="subtle"
      />

      <template #body>
        <div class="flex gap-5">
          <u-input
            v-model="goalInput"
            placeholder="Masukkan target sesi..."
            size="lg"
            class="grow"
          />
          <u-button label="Simpan" size="lg" class="w-fit" @click="saveGoal" />
        </div>
      </template>
    </u-modal>

    <h1 class="text-3xl font-bold">
      {{ store.isBreakTime ? "Waktunya Jeda!" : "Waktu Fokus!" }}
    </h1>

    <p v-if="store.sessionsGoals" class="text-md mt-2">
      Target: {{ store.sessionsGoals }}
    </p>

    <div class="text-6xl font-mono my-4">
      {{ store.timerDisplay }}
    </div>

    <p class="text-lg text-gray-600 dark:text-gray-300">
      Sesi selesai: {{ store.sessionsCompleted }}
    </p>

    <div class="flex gap-4 mt-4">
      <u-button
        size="lg"
        color="primary"
        variant="solid"
        :label="store.isCountingDown ? 'Jeda' : 'Mulai'"
        @click="store.isCountingDown ? store.pauseTimer() : store.startTimer()"
        :disabled="store.remainingSeconds === 0"
      />
      <u-button
        size="lg"
        variant="outline"
        label="Reset"
        @click="store.resetTimer()"
      />
      <u-button
        size="lg"
        variant="outline"
        label="Lewati"
        @click="store.skip()"
      />
    </div>
  </u-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePomodoroStore } from "~/store/pomodoro";

const store = usePomodoroStore();

const isModalOpen = ref(false);
const goalInput = ref(store.sessionsGoals || "");

function saveGoal() {
  store.setSessionsGoals(goalInput.value);

  isModalOpen.value = false;
}
</script>
