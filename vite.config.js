import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

export default defineConfig({
  plugins: [
    uni()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'uview-plus': path.resolve(__dirname, 'node_modules/uview-plus')
    }
  },
  server: {
    port: 48082,
    host: '0.0.0.0',
    proxy: {
      '/app-api': {
        target: 'http://192.168.0.4:48080',
        changeOrigin: true
      }
    }
  }
})