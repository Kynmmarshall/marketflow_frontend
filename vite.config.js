import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv reads .env files AND merges in matching process.env vars (e.g.
  // VITE_API_URL set by docker-compose.yml, with no .env file on disk) —
  // explicitly defining it here guarantees it reaches import.meta.env even
  // if the automatic exposure doesn't pick up a container-only env var.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
  }
})
