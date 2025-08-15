import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'prop-types': path.resolve(__dirname, 'node_modules/prop-types')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://s85-subhadeep-capstone-triptoindia-18.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
