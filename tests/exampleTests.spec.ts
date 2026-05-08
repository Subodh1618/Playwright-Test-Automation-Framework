import { test } from '@playwright/test'
import { BrowserContext, Page } from 'playwright'
import { DemoPage } from '../pageObjects/demoPage'

let demoPage: DemoPage
let page: Page
let context: BrowserContext
test.describe.configure({ mode: 'parallel' })

test.beforeAll(async () => {
  console.log('Before All hook execution')
})

test.beforeEach(async ({browser}) => {
  context = await browser.newContext()
  page = await context.newPage()
  demoPage = new DemoPage(page)
})

test.describe('Demo Login Tests', {tag: '@smoke'}, () => {
  test.beforeEach(async () => {
    await demoPage.navigateToWebsite()
  })

  test('Login test-1 @smoke @regression', async () => {
    await demoPage.validateWebsiteLoaded()
  })

  test('Login test-2 @regression', async () => {
    await demoPage.validateWebsiteLoaded()
  })

  test('Login test-3 @sanity @regression', async () => {
    await demoPage.validateWebsiteLoaded()
  })
})

test.afterEach(async () => {
    await page.close()
    await context.close()
})

test.afterAll(async ({browser}) => {
  await browser.close()
})
