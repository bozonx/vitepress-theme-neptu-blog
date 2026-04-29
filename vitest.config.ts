import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**', 'example/**', '.vitepress/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/**/*.d.ts', 'src/**/index.ts'],
    },
  },
  resolve: {
    alias: {
      'vitepress-theme-neptu-blog': path.resolve(__dirname, './src/index.ts'),
      'vitepress-theme-neptu-blog/*': path.resolve(__dirname, './src/*'),
    },
  },
})
