import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'SYNTHTRACK_')
  return {
    base: './',
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.SYNTHTRACK_API || 'http://127.0.0.1',
          changeOrigin: true,
        },
        '/s3': {
          target: env.SYNTHTRACK_S3 || 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/s3/, ''),
        },
      },
    },
  }
})
