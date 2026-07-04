import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the SauceDemo cart page.
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /** Remove a product from the cart by its slug. */
  async removeFromCart(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  /** Proceed to checkout. */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /** Assert the number of items currently in the cart. */
  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  /** Assert a product with the given name is present in the cart. */
  async expectItemVisible(name: string): Promise<void> {
    await expect(this.page.getByText(name)).toBeVisible();
  }
}
