import { defineConfig, devices } from '@playwright/test'

const previewCmd = 'pnpm --filter vitepress-theme-neptu-blog-docs preview --port 4173'
// On CI the docs are already built by a separate workflow step;
// locally we build first to ensure the preview server has content to serve.
const webServerCommand = process.env.CI
  ? previewCmd
  : `pnpm docs:build && ${previewCmd}`

export default defineConfig({
  testDir: '.',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: './playwright-report' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: webServerCommand,
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
