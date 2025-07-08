import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/zhm-react',
  server: {
    port: 5173, // 与主应用中 micro-app 的 url 端口一致
    open: false, // 不自动打开浏览器
    cors: true // 启用 CORS
  },
  build: {
    target: 'esnext', // 确保以 ES 模块标准构建
  },
  preview: {
    port: 4173, // 与主应用中 micro-app 的 url 端口一致
    open: false, // 不自动打开浏览器
    cors: true
  }
})
