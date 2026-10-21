import { defineConfig } from 'vite'
import path from 'path'
import react from './StudyClub-main/node_modules/@vitejs/plugin-react/dist/index.mjs'

export default defineConfig({
  root: path.resolve(__dirname, 'StudyClub-main'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'StudyClub-main/src')
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
