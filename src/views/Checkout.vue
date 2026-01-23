<template>
  <PinGate v-if="!unlocked" @success="onUnlock" />

  <div v-else class="checkout-container">
    <div class="header-bar">
      <router-link to="/" class="btn-back">
        <span class="back-icon">←</span>
      </router-link>
      <h1>結帳掃描</h1>
      <div class="spacer"></div>
    </div>

    <!-- 掃描區域 -->
    <div class="scanner-wrapper">
      <div id="qr-reader"></div>
      <div v-if="!scanning" class="scanner-controls">
        <button @click="startScan" class="btn-start">開始掃描</button>
      </div>
      <div v-else class="scanning-status">
        <p>掃描中...</p>
        <button @click="stopScan" class="btn-stop">停止掃描</button>
      </div>
    </div>

    <!-- 結果顯示 -->
    <div v-if="lastResult" class="result-card">
      <h2>掃描結果</h2>
      <div class="result-info">
        <p><strong>格號：</strong>{{ lastResult.gridNo }}</p>
        <p><strong>價格：</strong>NT$ {{ lastResult.price }}</p>
      </div>
      <div v-if="lastResult.txId" class="success-info">
        <p class="success-text">✓ 結帳成功！</p>
        <p><strong>交易ID：</strong>{{ lastResult.txId }}</p>
      </div>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- 完成訊息 -->
    <div v-if="finishMessage" class="finish-message">
      <div class="finish-icon">✓</div>
      <div class="finish-text">
        <h3>結帳完成！</h3>
        <p>{{ finishMessage }}</p>
      </div>
    </div>

    <!-- 歷史記錄 -->
    <div v-if="history.length > 0" class="history">
      <div class="history-header">
        <h2>本次結帳記錄</h2>
        <button @click="finishCheckout" class="btn-finish">完成結帳</button>
      </div>
      <div class="history-summary">
        <p><strong>總筆數：</strong>{{ history.length }} 筆</p>
        <p><strong>總金額：</strong>NT$ {{ totalAmount }}</p>
      </div>
      <div v-for="(item, index) in history" :key="index" class="history-item">
        <span>{{ item.gridNo }}</span>
        <span>NT$ {{ item.price }}</span>
        <span>{{ item.txId }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import PinGate from "@/components/PinGate.vue";
import { Html5Qrcode } from "html5-qrcode";
import { CheckoutService } from "@/services/checkoutService";
import { useLoadingStore } from "../stores/loading";

const unlocked = ref(false);
const scanning = ref(false);
const lastResult = ref<any>(null);
const errorMessage = ref("");
const history = ref<any[]>([]);
const finishMessage = ref("");

let html5QrCode: Html5Qrcode | null = null;

// 操作員名稱（可以從登入資訊取得，這裡先寫死）
const operator = ref("店員");

// Loading store
const loadingStore = useLoadingStore();

// 計算總金額
const totalAmount = computed(() => {
  return history.value.reduce((sum, item) => sum + item.price, 0);
});

onMounted(() => {
  unlocked.value = localStorage.getItem("checkout_unlocked") === "1";
});

onUnmounted(() => {
  // 只有在掃描器正在運行時才停止
  if (html5QrCode && scanning.value) {
    html5QrCode
      .stop()
      .then(() => {
        scanning.value = false;
      })
      .catch((err) => {
        // 忽略「掃描器未運行」的錯誤
        console.log("Scanner cleanup:", err);
      });
  }
});

function onUnlock() {
  unlocked.value = true;
}

async function startScan() {
  lastResult.value = null;
  errorMessage.value = "";

  try {
    // 確保 DOM 元素存在後才初始化
    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("qr-reader");
    }

    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanError
    );
    scanning.value = true;
  } catch (err: any) {
    errorMessage.value = `無法啟動相機：${err.message}`;
  }
}

async function stopScan() {
  if (html5QrCode && scanning.value) {
    await html5QrCode.stop();
    scanning.value = false;
  }
}

async function onScanSuccess(decodedText: string) {
  // 暫停掃描避免重複掃描
  await stopScan();

  errorMessage.value = "";

  try {
    // 解析 QR code 內容：格號|價格
    const parts = decodedText.split("|");
    if (parts.length !== 2) {
      throw new Error("QR Code 格式錯誤，應為：格號|價格");
    }

    const [gridNo, priceStr] = parts;
    const price = parseFloat(priceStr);

    if (isNaN(price)) {
      throw new Error("價格格式錯誤");
    }

    // 顯示掃描結果
    lastResult.value = {
      gridNo,
      price,
      txId: null,
    };

    // 顯示 loading
    loadingStore.show();

    // 呼叫 API 進行結帳
    const response = await CheckoutService.checkout({
      grid: gridNo,
      price: price,
      operator: operator.value,
    });

    // 隱藏 loading
    loadingStore.hide();

    if (response.success) {
      lastResult.value.txId = response.txId;

      // 加入歷史記錄
      history.value.unshift({
        gridNo,
        price,
        txId: response.txId,
      });
    } else {
      throw new Error("結帳失敗");
    }
  } catch (err: any) {
    // 確保 loading 被隱藏
    loadingStore.hide();

    errorMessage.value = err.message || "處理失敗";
    // 發生錯誤時，2秒後重新開始掃描
    setTimeout(() => {
      errorMessage.value = "";
      startScan();
    }, 2000);
  }
}

function onScanError(errorMessage: string) {
  // 掃描錯誤時不顯示（因為會一直偵測）
  // console.log(errorMessage);
}

async function finishCheckout() {
  // 記錄數量
  const count = history.value.length;
  const total = totalAmount.value;

  // 停止掃描
  if (scanning.value) {
    await stopScan();
  }

  // 清空記錄
  history.value = [];
  lastResult.value = null;
  errorMessage.value = "";

  // 顯示完成訊息
  finishMessage.value = `本次共 ${count} 筆交易，總金額：NT$ ${total}`;

  // 3秒後自動隱藏訊息
  setTimeout(() => {
    finishMessage.value = "";
  }, 3000);
}
</script>

<style scoped>
.checkout-container {
  min-height: 100svh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 15px;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 50%;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px) scale(1.05);
  border-color: rgba(255, 255, 255, 0.5);
}

.back-icon {
  font-size: 22px;
  font-weight: bold;
  line-height: 1;
}

.spacer {
  width: 44px;
  flex-shrink: 0;
}

h1 {
  text-align: center;
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
}

h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #1f2937;
}

.scanner-wrapper {
  margin-bottom: 20px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-out;
}

#qr-reader {
  border: 3px solid #667eea;
  border-radius: 12px;
  overflow: hidden;
  min-height: 250px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) inset;
}

#qr-reader:empty::before {
  content: "📷 請點擊下方按鈕開始掃描";
  color: #999;
  font-size: 16px;
  text-align: center;
}

.scanner-controls,
.scanning-status {
  margin-top: 15px;
  text-align: center;
}

.btn-start,
.btn-stop {
  padding: 14px 40px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-start {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
}

.btn-start:active {
  transform: translateY(0);
}

.btn-stop {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.4);
}

.btn-stop:active {
  transform: translateY(0);
}

.scanning-status p {
  margin-bottom: 10px;
  font-size: 16px;
  color: #10b981;
  font-weight: 600;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.result-card {
  background: white;
  border: none;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #10b981;
}

.result-info {
  margin-bottom: 15px;
}

.result-info p {
  margin: 10px 0;
  font-size: 16px;
  color: #374151;
}

.result-info strong {
  color: #1f2937;
}

.success-info {
  border-top: 2px solid #d1fae5;
  padding-top: 15px;
  margin-top: 15px;
}

.success-text {
  color: #10b981;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-text::before {
  content: "✓";
  display: inline-block;
  width: 28px;
  height: 28px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  font-size: 18px;
}

.error-message {
  background: white;
  border: none;
  border-left: 4px solid #ef4444;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 20px;
  color: #dc2626;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  animation: shake 0.5s ease-out;
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

.finish-message {
  background: white;
  border: none;
  border-left: 4px solid #10b981;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
}

.finish-icon {
  font-size: 56px;
  color: #10b981;
  line-height: 1;
}

.finish-text h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #059669;
  font-weight: bold;
}

.finish-text p {
  margin: 0;
  font-size: 16px;
  color: #047857;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.history {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-top: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
}

.history-header h2 {
  margin-bottom: 0;
  color: #1f2937;
}

.btn-finish {
  padding: 12px 28px;
  font-size: 14px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-finish:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
}

.btn-finish:active {
  transform: translateY(0);
}

.history-summary {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.history-summary p {
  margin: 0;
  font-size: 16px;
  color: #1e40af;
  font-weight: 600;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  transition: all 0.3s;
  border-left: 3px solid #10b981;
}

.history-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.history-item span:nth-child(1) {
  font-weight: bold;
  color: #1f2937;
  font-size: 15px;
}

.history-item span:nth-child(2) {
  color: #10b981;
  font-weight: bold;
  font-size: 15px;
}

.history-item span:nth-child(3) {
  color: #6b7280;
  font-size: 12px;
}

@media (max-width: 640px) {
  .checkout-container {
    padding: 15px;
  }

  .header-bar {
    flex-wrap: nowrap;
    gap: 10px;
  }

  .btn-back {
    width: 40px;
    height: 40px;
  }

  .back-icon {
    font-size: 20px;
  }

  h1 {
    font-size: 22px;
  }

  .scanner-wrapper,
  .history {
    padding: 16px;
  }

  .btn-start,
  .btn-stop,
  .btn-finish {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
