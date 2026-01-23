import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePinLockStore = defineStore("pinLock", () => {
  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 5 * 60 * 1000; // 5 分鐘（毫秒）

  const failedAttempts = ref(0);
  const isLocked = ref(false);
  const lockEndTime = ref(0);
  const remainingTime = ref(0);

  let countdownInterval: number | null = null;

  // 格式化剩餘時間
  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60000);
    const seconds = Math.floor((remainingTime.value % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  // 計算剩餘嘗試次數
  const attemptsLeft = computed(() => {
    return MAX_ATTEMPTS - failedAttempts.value;
  });

  // 初始化：檢查是否有鎖定記錄
  function initialize() {
    const savedLockEndTime = localStorage.getItem("pin_lock_end_time");
    const savedAttempts = localStorage.getItem("pin_failed_attempts");

    if (savedAttempts) {
      failedAttempts.value = parseInt(savedAttempts);
    }

    if (savedLockEndTime) {
      const endTime = parseInt(savedLockEndTime);
      const now = Date.now();

      if (now < endTime) {
        // 還在鎖定期間
        lockEndTime.value = endTime;
        isLocked.value = true;
        startCountdown();
      } else {
        // 鎖定時間已過，清除記錄
        clearLockData();
      }
    }
  }

  // 開始倒計時
  function startCountdown() {
    updateRemainingTime();

    countdownInterval = window.setInterval(() => {
      updateRemainingTime();

      if (remainingTime.value <= 0) {
        unlock();
      }
    }, 1000);
  }

  // 更新剩餘時間
  function updateRemainingTime() {
    const now = Date.now();
    remainingTime.value = Math.max(0, lockEndTime.value - now);
  }

  // 解鎖
  function unlock() {
    isLocked.value = false;
    clearLockData();

    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  // 清除鎖定數據
  function clearLockData() {
    failedAttempts.value = 0;
    localStorage.removeItem("pin_lock_end_time");
    localStorage.removeItem("pin_failed_attempts");
  }

  // 鎖定帳號
  function lockAccount() {
    isLocked.value = true;
    lockEndTime.value = Date.now() + LOCK_DURATION;
    localStorage.setItem("pin_lock_end_time", lockEndTime.value.toString());

    // 鎖定時立即重置失敗次數
    failedAttempts.value = 0;
    localStorage.removeItem("pin_failed_attempts");

    startCountdown();
  }

  // 記錄失敗嘗試
  function recordFailedAttempt() {
    failedAttempts.value++;
    localStorage.setItem(
      "pin_failed_attempts",
      failedAttempts.value.toString()
    );

    if (failedAttempts.value >= MAX_ATTEMPTS) {
      lockAccount();
      return true; // 返回 true 表示已鎖定
    }
    return false; // 返回 false 表示未鎖定
  }

  // 清除失敗記錄（登入成功時使用）
  function clearFailedAttempts() {
    clearLockData();
  }

  // 清理定時器
  function cleanup() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  return {
    // 狀態
    failedAttempts,
    isLocked,
    remainingTime,

    // 計算屬性
    formattedTime,
    attemptsLeft,

    // 方法
    initialize,
    recordFailedAttempt,
    clearFailedAttempts,
    cleanup,
  };
});
