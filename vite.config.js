import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `js/[name]-v1.js`,
        chunkFileNames: `js/[name]-v1.js`,
        assetFileNames: `assets/[name]-v1.[ext]`,
      },
    },
  },
  base: mode === 'production' ? '/blog-frontend/' : '/',
}))
