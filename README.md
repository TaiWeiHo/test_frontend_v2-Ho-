# 前端面試專案 - 實作紀錄

##  技術架構 

在開發過程中，為了滿足 SSR、TypeScript 與 RWD 需求，選用了以下技術棧：

**核心框架**: Nuxt 3 (Vue 3 Composition API)
**語言**: TypeScript (Strict Mode Enabled)
**狀態管理**: Pinia (配合 `@pinia/nuxt` 實現 SSR 資料同步)
**API 串接**: Axios (封裝為 Composable)
**樣式與 RWD**: UnoCSS (兼容 Tailwind 語法，輕量化 CSS 引擎)
**多語系**: Vue I18n (動態切換繁中/英文)

---

##  實作步驟 

### Phase 1: 環境建置與基礎配置
1.  初始化 Nuxt 專案，並安裝 `pinia`, `axios`, `i18n`, `unocss` 等核心依賴。
2.  **配置 `nuxt.config.ts`**：
    * 啟用 TypeScript `typeCheck: true` 以符合題目對 `vue-tsc` 的要求。
    * 解決 Windows 環境下 UnoCSS 路徑解析錯誤 (`Received protocol 'e:'`)，將設定檔整合至 Nuxt Config 中。

### Phase 2: 組件封裝 (Component Encapsulation)
**`EBtn.vue`**: 
    * 實作 `variant` 屬性 (Primary/Warning/Danger)。
    * 加入 `hover` 與 `active` 的互動樣式。
**`ETextField.vue`**: 
    * 不使用 Vue 3.4 的 `defineModel`，而是透過 **`computed` 的 getter/setter** 配合 `emit('update:value')` 

### Phase 3: 狀態管理與 API 串接 (State & API)
1.  **Axios 封裝**: 建立 `composables/useApi.ts`，統一管理 BaseURL。
2.  **Pinia Store (`stores/user.ts`)**:
    * 實作 CRUD (Create, Read, Update, Delete) 邏輯。

### Phase 4: 頁面邏輯與 SSR (Page Logic)
1.  **SSR 資料獲取**：
    * 使用 `await useAsyncData` 在伺服器端預先抓取資料，並同步至 Pinia Store，確保頁面載入時已有內容。
2.  **多語系實作 (i18n)**：
    * **問題排除**：在 SSR 階段手動 `import { useI18n }` 導致 Hydration Mismatch 報錯。
    * **解決方案**：改用 Nuxt 自動引入的 `useI18n()` 並透過解構賦值 (`const { locale, locales } = useI18n()`)，並將 `<select>` 選單改為動態讀取 `locales` 設定，修復了語言切換失效的問題。

### Phase 5: UI/UX 與 RWD 優化
1.  **Dialog 交互**：使用原生 HTML `<dialog>` 標籤實作確認視窗，並加入 Fade-in 動畫提升質感。
2.  **320px 極小螢幕適配**：
    * **策略**：在手機版 (< 768px) 放棄傳統表格 (Table) 佈局。
    * **實作**：利用 CSS Grid/Flex 將每一行資料轉換為**卡片 (Card)** 形式垂直排列，解決了手機版表格過於擁擠、無法閱讀的問題。
3.  **深色模式優化**：針對 `<select>` 與 `<input>` 在深色背景下的對比度進行微調，確保文字清晰。

---

