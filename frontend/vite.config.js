import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 10000,
    strictPort: true,
    allowedHosts: [
      'ecell-2025-26.onrender.com',
      '.onrender.com'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 10000,
    strictPort: true,
    allowedHosts: [
      'ecell-2025-26.onrender.com',
      '.onrender.com'
    ]
  }
})
