import { defineConfig } from 'vitest/config'

// Isolated test config: the app's vite.config.ts loads the TanStack Start plugin,
// which is incompatible with the vitest runner. Keep module and component
// checks independent of the application server.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: { '~': new URL('./src', import.meta.url).pathname },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
