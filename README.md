# 專案名稱

專案名稱

本專案使用 Vue 3 + Vite + TypeScript 開發

## 目錄

- [使用工具](#使用工具)
- [環境建立](#環境建立)
- [下載及執行專案](#下載及執行專案)
- [開發流程](#開發流程)
  - [建立開發分支](#建立開發分支)
  - [提交程式碼](#提交程式碼)
- [Commit 規範](#commit-規範)
- [專案架構](#專案架構)
- [程式碼風格規範](#程式碼風格規範)
- [.vue 檔開發規範](#.vue-檔開發規範)

## 使用工具

- Node.js 執行環境 - [20.15.1](https://nodejs.org/zh-tw)
- 套件管理 - [pnpm 10](https://pnpm.io/zh-TW/installation)
- 版本控制 - [Git](https://git-scm.com)
- 編輯器 - [Visual Studio Code](https://code.visualstudio.com)

## 環境建立

1. 安裝 Node.js 20.15.1 LTS（建議使用 [Volta](https://docs.volta.sh/guide/) 或 [nvm](https://github.com/nvm-sh/nvm) 安裝及管理 Node 版本。
2. 安裝 pnpm - 參考 [官網安裝說明](https://pnpm.io/zh/installation) 或直接使用以下指令安裝。

   ```bash
   npm install -g pnpm
   ```

3. 安裝 Git - 從 [官網](https://git-scm.com/) 下載並安裝 GIT。

## 下載及執行專案

```bash
git clone git@專案位置
cd 專案名稱
git checkout develop
pnpm install
pnpm run dev
```

使用 VS Code 開啟專案，並安裝專案推薦套件（VS Code 右下角會提示安裝）

## 開發流程

### 建立開發分支

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<your-feature-name>
```

### 提交程式碼

執行以下步驟時，<mark> 請確保所有修改都已 commit 或
stash，避免操作失敗，修改記錄遺失 </mark>，有疑問請詢問專案負責工程師。

1. 使用 `git rebase -i` 合併 commit
2. 使用 `git checkout develop` 切換 develop 分支
3. 使用 `git pull` 更新到最新 develop
4. 使用 `git checkout <branch>` 切換到開發分支
5. 使用 `git merge develop` 與 develop 同步（有衝突請協調）
6. 使用 `git push origin <branch>`

## Commit 規範

參考採用 [Conventional Commits](https://www.conventionalcommits.org/zh-hant/v1.0.0/)

```text
[feature] 新增功能
[modify] 修改功能
[fix] 修正錯誤
[refactor] 重構程式碼 (不含 Bug 修復及新增功能)
[build] 部署用
```

## 專案架構

```bash
├── .vscode/                    # VSCode 設定
├── public/                     # 靜態資源
├── src/                        # 主程式資源
│   ├── assets                  # 圖片 / 圖示
│   ├── components              # 公用組件
│   ├── composables             # 共用 Vue 組合式函數
│   ├── enums                   # Enum 定義
│   ├── i18n                    # 多語系統
│   ├── models                  # 型別定義
│   ├── router                  # Vue Router
│   ├── services                # API 層
│   ├── stores                  # Pinia Store
│   ├── utils                   # 工具函數
│   ├── views                   # Page View
│   ├── App.vue                 # 根組件
│   └── main.ts                 # 入口點
│   ├── vite-env.d.ts           # 全域型別
├── .cspellignore               # cspell 忽略清單（共用排除規則）
├── .editorconfig               # Editor 格式化規則
├── .env.*                      # 環境變數檔案
├── .eslintrc-auto-import.json  # 自動匯入 globals 設定
├── .gitignore                  # Git 忽略規則
├── .nvmrc                      # 指定 Node.js 版本
├── .prettierignore             # Prettier 忽略檔案清單
├── .prettierrc.json            # Prettier 設定
├── auto-imports.d.ts           # 自動匯入的型別定義
├── commitlint.config.mjs       # CommitLint (commit‑msg) 規則
├── components.d.ts             # 全域共用元件自動引入
├── cspell.json                 # cspell 拼字檢查設定
├── eslint.config.mjs           # ESLint Flat Config 設定
├── index.html                  # HTML 入口檔
├── package.json                # 專案描述與指令
├── pnpm‑lock.yaml              # pnpm 鎖定檔
├── postcss.config.cjs          # PostCSS 設定
├── README.md                   # 專案說明文件
├── tailwind.config.js          # Tailwind CSS 設定
├── tsconfig.json               # TypeScript 設定
├── vite.config.ts              # Vite 設定
```

## 程式碼風格規範

- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) - 自動 import 常用 API
- [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) - 自動註冊 src/components 底下的 .vue 元件
- [EditorConfig](https://editorconfig.org) - 統一編輯器（VSCode/WebStorm/Vim）排版設定
- [ESLint](https://eslint.org) - 檢查程式碼語法、統一編寫風格
- [Prettier](https://prettier.io) - 統一程式碼排版風格
- [CSpell](https://github.com/streetsidesoftware/cspell) - 自動檢測專案裡的拼字錯誤
- [Stylelint](https://stylelint.io) - 檢查樣式語法、統一編寫風格

## .vue 檔開發規範

### script 區域編排建議

- 📌 **組件設定**（`defineOptions`、`defineProps`、`defineEmits`、`defineModel`、`defineSlots`）
- 🧭 **路由與 Store**（`useRoute`、`useRouter`、Pinia Store）
- 📦 **功能區塊**（依模組分區）
  - const / ref / reactive
  - computed
  - 方法（function / async）
  - watch
  - lifecycle
- 🚪 **對外 expose**（defineExpose）

### script 區塊範例

```ts
<script setup lang="ts">
/* ===================== 組件設定 ===================== */
defineOptions({ name: 'example-component' })
const props = defineProps<{}>()
const emit = defineEmits<{}>()
const modelValue = defineModel()
const slots = defineSlots()

/* ===================== 路由與 store ===================== */
const route = useRoute()
const router = useRouter()
const store = useUserStore()

/* ===================== 登入功能區 ===================== */
const loginForm = ref({ user: '', pwd: '' })
const isLoading = ref(false)
const isValid = computed(() => loginForm.value.user !== '')
async function submitLogin() {
  isLoading.value = true
  // do login
  isLoading.value = false
}

/* ===================== 監聽 & 生命周期 ===================== */
watch(() => loginForm.value.user, () => {})
onMounted(() => {})

/* ===================== 對外 expose ===================== */
defineExpose({ submitLogin, loginForm })
</script>
```
