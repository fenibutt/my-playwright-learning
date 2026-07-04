import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the SauceDemo checkout flow
 * (Step One: info form, Step Two: overview, Complete: confirmation).
 */
export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;
  readonly overviewItemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.overviewItemNames = page.locator('[data-test="inventory-item-name"]');
  }

  /** Fill the customer information form and continue to the overview. */
  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Assert a product with the given name is listed on the overview page. */
  async expectOverviewItem(name: string): Promise<void> {
    await expect(this.overviewItemNames.filter({ hasText: name })).toBeVisible();
  }

  /** Complete the order on the overview page. */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /** Assert the order was placed successfully. */
  async expectOrderComplete(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  /** Assert a validation error is shown on the information form. */
  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(message);
  }
}
