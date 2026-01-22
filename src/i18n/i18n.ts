import { createI18n } from "vue-i18n";
import zh from "./default_zh.json";
import en from "./default_en.json";

export const i18n = createI18n({
  legacy: false,
  allowComposition: true,
  locale: localStorage.getItem("locale") || "zh",
  messages: { zh, en },
});

export const langType = [
  {
    name: "中",
    locale: "zh",
  },
  {
    name: "EN",
    locale: "en",
  },
];
