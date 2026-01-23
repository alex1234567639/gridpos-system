import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 把 @ 定義在 src 目錄 (tsconfig.json 也要設定)
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/gridpos-system/",
  plugins: [
    vue(),
    /**
     * unplugin-auto-import Setting
     * https://github.com/antfu/unplugin-auto-import
     * 自動 import 常用 API（如 vue / vue-router / pinia…）
     * 設定後要先 pnpm run dev 產生 eslintrc-auto-import.json, auto-imports.d.ts
     * tsconfig.json 也要設定 include auto-imports.d.ts"
     */
    AutoImport({
      // 1. 指定要自動 import 的 API
      imports: [
        "vue",
        "vue-router",
        {
          // 若有其他套件也可引入
          "@vueuse/core": ["useMouse", "useEventListener"],
        },
      ],

      // 2. 產生到根目錄，讓 ESLint 可以讀到
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: "readonly",
      },

      // 3. 產生 TS 聲明檔
      dts: "auto-imports.d.ts",
    }),

    /**
     * 自動註冊 src/components 底下的 .vue 元件
     * 設定後要先 pnpm run dev 產生 components.d.ts\
     * tsconfig.json 也要設定 include components.d.ts"
     */
    Components({
      dirs: ["src/components"],
      extensions: ["vue"],
      deep: true,
      dts: "components.d.ts", // 產生類型定義檔
    }),
  ],
  server: {
    host: "0.0.0.0", // 允許外部訪問
  },
});
