import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: true,  // allows external access
    allowedHosts: [
      'annett-orthopterous-unmorbidly.ngrok-free.dev',
      'localhost',
      '127.0.0.1'
    ],
    hmr: {
      host: 'annett-orthopterous-unmorbidly.ngrok-free.dev'
    }
  }
})
