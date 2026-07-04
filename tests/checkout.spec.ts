import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { standardUser, products, checkoutInfo, errors } from '../test-data/users';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    await loginPage.expectLoggedIn();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
  });

  test('completes an order end to end', async () => {
    await test.step('start checkout from the cart', async () => {
      await cartPage.checkout();
    });

    await test.step('enter customer information', async () => {
      await checkoutPage.fillInformation(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode,
      );
    });

    await test.step('overview lists the selected product', async () => {
      await checkoutPage.expectOverviewItem('Sauce Labs Backpack');
    });

    await test.step('finish the order and see the confirmation', async () => {
      await checkoutPage.finish();
      await checkoutPage.expectOrderComplete();
    });
  });

  test('requires a first name on the information form', async () => {
    await cartPage.checkout();
    await checkoutPage.fillInformation('', checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.expectError(errors.firstNameRequired);
  });
});
