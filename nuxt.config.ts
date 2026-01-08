// nuxt.config.ts
// import { defineNuxtConfig } from 'nuxt/config'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // 12. vue-tsc 檢查必須通過
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
    // 修復 i18n 警告
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  // 將原本 uno.config.ts 的設定移到這裡，解決 Windows 路徑報錯
  unocss: {
    nuxtLayers: true,
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons()
    ]
  },

  postcss: {
    plugins: {
      'postcss-preset-env': {
        stage: 1,
        features: {
          'nesting-rules': true,
        },
      },
      'postcss-nested': {},
      'postcss-pxtorem': {
        rootValue: 16,
        propList: ['*'],
        exclude: /node_modules/i,
      },
      autoprefixer: {
        overrideBrowserslist: ['last 2 versions', '> 1%'],
      },
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 加入這行來忽略型別報錯
          // @ts-ignore
          api: 'modern-compiler',
        },
      },
    },
  },

  css: ['~/assets/css/style.scss'],
})