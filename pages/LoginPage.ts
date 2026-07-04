import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the SauceDemo login page (https://www.saucedemo.com).
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Open the login page. Uses baseURL from playwright.config.ts. */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Fill credentials and submit. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Assert that login succeeded and we landed on the inventory page. */
  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);
  }

  /** Assert that a given error message is shown. */
  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(message);
  }
}
