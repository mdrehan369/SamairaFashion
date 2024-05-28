import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // const env = loadEnv(mode, process.cwd());

  // return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:3000'
        // '/api': env.VITE_BACKEND_URL
      }
    }
  // }
})
