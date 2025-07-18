import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: ['ecell-2025-26.onrender.com']
  }
})