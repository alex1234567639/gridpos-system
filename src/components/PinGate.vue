<template>
  <div class="pin-gate-overlay">
    <div class="pin-gate-card">
      <div class="icon-container">
        <div class="lock-icon">🔒</div>
      </div>

      <h2>身份驗證</h2>
      <p class="subtitle">請輸入店內結帳碼</p>

      <div class="input-wrapper">
        <input
          v-model="inputPin"
          type="password"
          inputmode="numeric"
          maxlength="6"
          placeholder="請輸入 PIN 碼"
          @keyup.enter="submit"
          class="pin-input"
        />
      </div>

      <button @click="submit" class="submit-btn">
        <span>進入結帳</span>
        <span class="arrow">→</span>
      </button>

      <transition name="shake">
        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
        </div>
      </transition>
    </div>
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
  if (!inputPin.value) {
    error.value = "請輸入結帳碼";
    return;
  }

  if (inputPin.value === CHECKOUT_PIN) {
    localStorage.setItem("checkout_unlocked", "1");
    error.value = "";
    emit("success");
  } else {
    error.value = "結帳碼錯誤，請重試";
    inputPin.value = "";
  }
}
</script>

<style scoped>
.pin-gate-overlay {
  min-height: 100svh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.pin-gate-card {
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-container {
  margin-bottom: 24px;
}

.lock-icon {
  font-size: 64px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

h2 {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
  text-align: center;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px 0;
  text-align: center;
}

.input-wrapper {
  width: 100%;
  margin-bottom: 24px;
}

.pin-input {
  width: 100%;
  padding: 16px 20px;
  font-size: 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s;
  text-align: center;
  letter-spacing: 4px;
  font-weight: 600;
  background: #f9fafb;
}

.pin-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.pin-input::placeholder {
  letter-spacing: normal;
  font-weight: normal;
  color: #9ca3af;
}

.submit-btn {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

.arrow {
  font-size: 20px;
  transition: transform 0.3s;
}

.submit-btn:hover .arrow {
  transform: translateX(4px);
}

.error-message {
  margin-top: 20px;
  padding: 12px 20px;
  background: #fee2e2;
  border: 2px solid #ef4444;
  border-radius: 10px;
  color: #dc2626;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.error-icon {
  font-size: 18px;
}

.shake-enter-active {
  animation: shake 0.5s;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@media (max-width: 640px) {
  .pin-gate-card {
    padding: 40px 24px;
  }

  h2 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .lock-icon {
    font-size: 56px;
  }
}
</style>
