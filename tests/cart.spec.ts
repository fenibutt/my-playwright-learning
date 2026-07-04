import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { standardUser, products } from '../test-data/users';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    await loginPage.expectLoggedIn();
  });

  test('adds a product to the cart', async () => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartCount(1);
  });

  test('removes a product from the cart', async () => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartCount(1);
    await inventoryPage.removeFromCart(products.backpack);
    await inventoryPage.expectCartEmpty();
  });

  test('adds three products and removes one', async () => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.addToCart(products.boltTShirt);
    await inventoryPage.expectCartCount(3);
    await inventoryPage.removeFromCart(products.backpack);
    await inventoryPage.expectCartCount(2);
  });

  test('cart contents survive a page reload', async ({ page }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartCount(1);
    await page.reload();
    await inventoryPage.expectCartCount(1);
  });

  test('shows added products on the cart page', async () => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    const cartPage = new CartPage(inventoryPage.page);
    await cartPage.expectItemCount(1);
    await cartPage.expectItemVisible('Sauce Labs Backpack');
  });
});
