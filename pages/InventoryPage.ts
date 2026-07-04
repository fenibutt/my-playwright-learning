import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the SauceDemo inventory (products) page.
 */
export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /**
   * Add a product to the cart by its slug.
   * Example: addToCart('sauce-labs-backpack')
   */
  async addToCart(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  /** Remove a product from the cart by its slug. */
  async removeFromCart(productSlug: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  /** Sort products, e.g. 'az', 'za', 'lohi', 'hilo'. */
  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Collect all product prices as numbers, in the order they appear on the page.
   * Strips the leading "$" from each price label (e.g. "$9.99" -> 9.99).
   */
  async getPrices(): Promise<number[]> {
    const labels = await this.itemPrices.allTextContents();
    return labels.map((label) => Number(label.replace('$', '').trim()));
  }

  /** Go to the cart page. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** Assert the cart badge shows the expected count. */
  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  /** Assert the cart badge is not visible (cart is empty). */
  async expectCartEmpty(): Promise<void> {
    await expect(this.cartBadge).not.toBeVisible();
  }
}
