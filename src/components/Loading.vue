<script setup lang="ts">
import { useLoadingStore } from "../stores/loading";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);
const { t } = useI18n();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
    >
      <div class="flex flex-col items-center gap-2">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"
        ></div>
        <div class="text-white">{{ t("loading") }}</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
