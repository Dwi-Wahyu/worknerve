<template>
  <div class="w-full flex gap-3 items-center">
    <Icon name="lucide-loader" class="animate-spin size-5" />

    <h1>
      {{ label }}
    </h1>
  </div>
</template>

<script setup>
defineProps({
  label: {
    default: "Loading Data . . .",
  },
});
</script>
