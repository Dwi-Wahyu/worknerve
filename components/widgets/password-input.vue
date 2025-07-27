<template>
  <div class="relative">
    <u-input
      :type="showPassword ? 'text' : 'password'"
      v-model="internalValue"
      :placeholder="placeholder"
      :class="inputClass"
      :ui="inputUi"
      :required="required"
      @update:model-value="emit('update:modelValue', $event)"
      v-bind="$attrs"
    >
      <template #trailing>
        <u-button
          variant="ghost"
          :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
          :padded="false"
          @click="togglePasswordVisibility"
          aria-label="Toggle password visibility"
        />
      </template>
    </u-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Masukkan kata sandi Anda",
  },
  inputClass: {
    type: String,
    default: "",
  },
  inputUi: {
    type: Object,
    default: () => ({}),
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);
const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue;
  }
);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped></style>
