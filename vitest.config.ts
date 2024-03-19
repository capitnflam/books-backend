// eslint-disable-next-line import/no-unresolved
import swc from 'unplugin-swc'
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov'],
    },
  },
})
