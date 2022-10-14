/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'staging' | 'production' | 'development' | 'test'
  readonly USE_DEV_SERVER: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_DD_RUM_APP_ID: string
  readonly VITE_DD_RUM_CLIENT_TOKEN: string
  readonly VITE_DD_RUM_ENV: string
  readonly VITE_PUBLIC_URL: string
  readonly VITE_BASE_URL: string
  readonly VITE_FORMSG_SDK_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
