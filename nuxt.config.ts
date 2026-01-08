// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // vue-tsc 檢查必須通過
  typescript: {
    strict: true,
    typeCheck: true
  },

  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxt/image',
    '@unocss/nuxt',
    '@nuxtjs/google-fonts'
  ],

  googleFonts: {
    display: 'swap',
    download: false,
    families: {
      'Noto Sans TC': true,
    },
  },

  image: {
    provider: 'ipx',
    presets: {
      default: {
        modifiers: {
          format: 'webp',
          quality: 75,
        },
      },
    },
  },

  i18n: {
    locales: [
      {
        code: 'zh-TW',
        file: 'tw.json',
        language: 'zh-TW',
        name: '繁體中文',
      },
      {
        code: 'en-US',
        file: 'en.json',
        language: 'en-US',
        name: 'English',
      },
    ],
    lazy: true,
    langDir: 'language/',
    defaultLocale: 'zh-TW',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'zh-TW',
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  // UnoCSS 設定
  unocss: {
    nuxtLayers: true,
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons()
    ]
  },

  // ★★★ 關鍵修改：刪除了 postcss 區塊 ★★★
  // 因為你有安裝 sass，樣式巢狀 (Nesting) 交給 SCSS 處理即可，
  // 移除 postcss 可以解決 Vercel 部署時 UnoCSS 掃描報錯的問題。

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // @ts-ignore
          api: 'modern-compiler',
        },
      },
    },
  },

  css: ['~/assets/css/style.scss'],
})