// src/stores/pomodoro.ts
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const usePomodoroStore = defineStore("pomodoroStore", () => {
  const sessionsCompleted = useStorage("pomodoro-sessions-completed", 0);
  const sessionLength = useStorage("pomodoro-session-length", 25);
  const shortBreakLength = useStorage("pomodoro-short-break-length", 5);
  const longBreakLength = useStorage("pomodoro-long-break-length", 15);

  const isBreakTime = useStorage("pomodoro-is-break-time", false);
  const isCountingDown = useStorage("pomodoro-is-counting-down", false);
  const remainingSeconds = useStorage("pomodoro-remaining-seconds", 25 * 60);

  const sessionsGoals = useStorage("pomodoro-sessions-goals", "");

  let interval: ReturnType<typeof setInterval> | null = null;

  const timerDisplay = computed(() => {
    const minutes = Math.floor(remainingSeconds.value / 60);
    const seconds = remainingSeconds.value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  });

  function startTimer() {
    if (isCountingDown.value) return;
    isCountingDown.value = true;

    interval = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
      } else {
        endSession();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (interval) {
      clearInterval(interval);
      isCountingDown.value = false;
    }
  }

  function resetTimer() {
    pauseTimer();
    isBreakTime.value = false;
    remainingSeconds.value = sessionLength.value * 60;
    sessionsCompleted.value = 0;
  }

  function skip() {
    endSession();
  }

  function endSession() {
    pauseTimer();

    if (!isBreakTime.value) {
      sessionsCompleted.value++;
      isBreakTime.value = true;
      remainingSeconds.value =
        sessionsCompleted.value >= 4
          ? longBreakLength.value * 60
          : shortBreakLength.value * 60;
    } else {
      isBreakTime.value = false;
      if (sessionsCompleted.value >= 4) {
        sessionsCompleted.value = 0;
      }
      remainingSeconds.value = sessionLength.value * 60;
    }
    startTimer();
  }

  function setSessionsGoals(goal: string) {
    sessionsGoals.value = goal;
  }

  return {
    sessionsCompleted,
    isBreakTime,
    isCountingDown,
    remainingSeconds,
    sessionsGoals,
    timerDisplay,
    startTimer,
    pauseTimer,
    resetTimer,
    skip,
    setSessionsGoals,
  };
});
