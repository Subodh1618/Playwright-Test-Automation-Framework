import { Dialog, expect, Locator, Page } from '@playwright/test'
import { getEnvConfig } from '../configs/env.config'

export class DemoPage {
  private readonly page: Page
  private readonly dropdown: Locator
  private readonly buttonForNewPage: Locator
  private readonly locatorFoundInaPage: Locator
  private readonly button1WhichOpensNewPage: Locator
  private readonly button2WhichOpensNewPage: Locator
  private readonly button3WhichOpensNewPage: Locator
  private readonly searchTextBox: Locator

  constructor(page: Page) {
    this.page = page
    this.searchTextBox = page.locator('//textArea[@title = "Search"]')

    //Example Locators to demonstrate few improtant handlings (Xpath or Id to be updated accordingly)
    this.dropdown = page.locator('#dropdown')
    this.buttonForNewPage = page.locator('#button')
    this.button1WhichOpensNewPage = page.locator('#button1')
    this.button2WhichOpensNewPage = page.locator('#button1')
    this.button3WhichOpensNewPage = page.locator('#button1')
    this.locatorFoundInaPage = page.locator('#locatorInaPage')
  }
  readonly environment = (process.env.ENV as 'test' | 'dev') || 'test'
  readonly envConfig = getEnvConfig(this.environment)

  async navigateToWebsite() {
    await this.page.goto(this.envConfig.testUrl)
    console.log('Navigated to website: ', this.envConfig.testUrl)
  }

  async validateWebsiteLoaded() {
    await expect(this.searchTextBox).toBeVisible()
    console.log('Website has loaded and search box is visible')
  }

  /**
   * This is an example method to select an option from dropdown
   * @param country 
   */
  async selectOption(country: string) {
    await this.dropdown.waitFor({ state: 'visible', timeout: 10000 })
    await this.dropdown.selectOption({label: country})
  }

  /**
   * This is an example method to select multiple options from dropdown based on label
   * @param country[]
   */
  async selectMultipleOptions(country: string[]) {
    await this.dropdown.selectOption(country.map(c => ({label: c})))
  }

  /**
   * Handle new page opening on clicking something, check new page opened, close new page and come back to main page
   */
  async openNewPageAndComeBackToParentPage() {
    const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.buttonForNewPage.click({force: true, timeout: 100})
    ])
    await newPage.waitForLoadState('domcontentloaded', {timeout: 2000})
    const title = await newPage.title()
    console.log('New page title:', title);
    expect(newPage).toHaveTitle('New Page Demo')
    await newPage.close()

    await this.page.bringToFront()
  }

  /**
   * Handle Page switching when many pages are there. Switch to a page, do some operation and then come back to main page
   */
  async switchToDesiredPageFromAllPages() {
    const allPages = [this.page]
    const context = this.page.context()
    context.on('page', async (page: Page) => {
        allPages.push(page)
        await page.waitForLoadState('domcontentloaded')
    })
    await Promise.all([
        this.button1WhichOpensNewPage.click(),
        this.button2WhichOpensNewPage.click(),
        this.button3WhichOpensNewPage.click(),
    ])
    for(const page of allPages) {
        page.bringToFront()
        const elementFound = await this.locatorFoundInaPage.isVisible()
        if(elementFound) {
            //do some operation on this page
            break;
        }
        if (page !== this.page) {
            await page.close()
        }
    }
    await this.page.bringToFront()
  }

  /**
   * Handle alert dialog - alert, confirm & prompt
   * @param promptText 
   */
  async handleDialog(promptText?: string) {
    this.page.on('dialog', async (dialog: Dialog) => { //use --> this.page.once() for one time handling
       const msg = dialog.message()
       const dialogType = dialog.type()
       switch(dialogType) {
        case 'alert':
            await dialog.accept()
        case 'confirm':
            if (dialog.message().includes('agree')) {
            await dialog.accept();
            } else { await dialog.dismiss()}
        case 'prompt':
            if(promptText) {
                await dialog.accept(promptText)
            } else {
                await dialog.dismiss()
            }
        default:
            await dialog.dismiss()
        }
    })
  }
}
