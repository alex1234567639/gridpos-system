# PWA 圖標指南

請準備以下兩個 PNG 圖標文件，放置在 `public` 目錄中：

## 需要的圖標

1. **pwa-192x192.png** (192x192 像素)

   - 用於 Android 設備的小圖標
   - 建議使用格子鋪的 LOGO

2. **pwa-512x512.png** (512x512 像素)
   - 用於 Android 設備的大圖標和啟動畫面
   - 建議使用格子鋪的 LOGO

## 快速生成方法

### 選項 1: 使用線上工具

訪問 https://realfavicongenerator.net/
上傳你的 LOGO，它會自動生成所有需要的尺寸

### 選項 2: 使用 Figma/Photoshop

1. 創建 512x512 的畫布
2. 放置你的 LOGO（建議周圍留 10% 的邊距）
3. 導出為 PNG：
   - pwa-512x512.png (512x512)
   - pwa-192x192.png (192x192)

### 選項 3: 使用臨時圖標

如果暫時沒有 LOGO，可以使用純色背景 + 文字：

- 背景色：#667eea（紫色漸層）
- 文字：「格子鋪」或 「POS」
- 字體：白色、粗體

## 完成後

將這兩個文件放在 `public` 目錄：

```
public/
  ├── pwa-192x192.png
  ├── pwa-512x512.png
  └── vite.svg
```

然後刪除此說明文件（pwa-icon-guide.md）
