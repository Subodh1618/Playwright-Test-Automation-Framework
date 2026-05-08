
import { defineConfig, PlaywrightTestOptions, Project } from '@playwright/test'
import { getEnvConfig } from './env.config'

const env = (process.env.ENV as 'test' | 'dev') || 'test'
const envConfig = getEnvConfig(env)

const browsers = (process.env.BROWSERS || 'chromium').split(',')

const projects: Project<PlaywrightTestOptions>[] = []
if (browsers.includes('chrome')) {
  projects.push({
    name: 'Chrome',
    use: {
      browserName: 'chromium',
      launchOptions: {
        args: ['--start-maximized', '--disable-gpu', '--disable-webgl'],
      },
    },
  } as Project<PlaywrightTestOptions>)
}
if (browsers.includes('edge')) {
  projects.push({
    name: 'MSEdge',
    use: {
      browserName: 'chromium',
      channel: 'msedge',
      launchOptions: {
        args: ['--start-maximized', '--disable-gpu', '--disable-webgl'],
      },
    },
  } as Project<PlaywrightTestOptions>)
}

if (browsers.includes('firefox')) {
  projects.push({
    name: 'Firefox',
    use: {
      browserName: 'firefox',
      launchOptions: {
        args: ['--start-maximized', '--disable-gpu', '--disable-webgl'],
      },
    },
  } as Project<PlaywrightTestOptions>)
}
console.log('Playwright projects to run{}:', projects.map(p => p.name));

export default defineConfig({
  timeout: 15 * 100 * 1000,
  expect: {
    timeout: 100000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 2,
  retries: 1,
  testDir: '../tests/',
  reporter: [
    ['dot'],
    [
      'monocart-reporter',
      {
        name: 'Test Report',
        outputFile: './test-results/report.html',
      },
    ],
    [
      'junit',
      {
        name: 'Test Report',
        outputFile: '../test-results/report.xml',
      },
    ],
    ['allure-playwright', 
      {
        name: 'Allure Report'
      }
    ]
  ],
  use: {
    headless: false,
    baseURL: envConfig.testUrl,
    viewport: { width: 1280, height: 720 },
    navigationTimeout: 1200 * 1000,
    actionTimeout: 460 * 1000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects,
});
