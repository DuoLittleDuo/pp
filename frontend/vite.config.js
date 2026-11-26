import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      // 编辑器保存时会短暂生成临时目录，忽略掉，避免监听器报 EBUSY
      ignored: ['**/*.tmp', '**/.*.tmpdir/**', '**/node_modules/**', '**/dist/**'],
    },
    proxy: {
      // 垚垚后端：uvicorn src.server:app --port 8000
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
