<template>
  <div class="pin-gate">
    <h2>請輸入店內結帳碼</h2>

    <input
      v-model="inputPin"
      type="password"
      inputmode="numeric"
      maxlength="6"
      placeholder="PIN"
    />

    <button @click="submit">進入結帳</button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const inputPin = ref("");
const error = ref("");
const emit = defineEmits<{
  (e: "success"): void;
}>();

const CHECKOUT_PIN = import.meta.env.VITE_CHECKOUT_PIN;

function submit() {
  if (inputPin.value === CHECKOUT_PIN) {
    localStorage.setItem("checkout_unlocked", "1");
    emit("success");
  } else {
    error.value = "結帳碼錯誤";
    inputPin.value = "";
  }
}
</script>

<style scoped>
.pin-gate {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 240px;
  margin: 80px auto;
}
.error {
  color: red;
}
</style>
