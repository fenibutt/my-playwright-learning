import { test, expect } from '@playwright/test';
import { only } from 'node:test';

test.describe("week3", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
  });

  test("login works successfully", async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test("login fails with wrong credentials", async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();
    await expect(
      page.getByText("Epic sadface: Username and password do not match any user in this service")
    ).toBeVisible();
  });

  test("Add product to cart", async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        "Cart badge should show 1 after adding a product"
      ).toHaveText("1");

  });

  test("Remove product from cart.", async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        "Cart badge should show 1 after adding a product"
      ).toHaveText("1");
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        "Cart badge should show 1 after adding a product"
      ).not.toBeVisible();
  });

  test("Empty form validation.", async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();
    await expect(
        page.getByText("Epic sadface: Username is required")
      ).toBeVisible();
  });

  test("Add 3 products to cart and remove one of the items", async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        "Cart badge should show 3 after adding a product"
      ).toHaveText("3");
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        "Cart badge should show 2 after adding a product"
      ).toHaveText("2");
  });

  test("sorting", async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    await expect(
        page.locator('[data-test="inventory-item-name"]').first()
      ).toHaveText("Sauce Labs Backpack");
    await page.locator('[data-test="product-sort-container"]').selectOption("lohi");
    await expect(
        page.locator('[data-test="inventory-item-name"]').first()
      ).toHaveText("Sauce Labs Onesie");
 });

 test("refresh", async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        "Cart badge should show 1 after adding a product"
      ).toHaveText("1");
    await page.reload();
    await expect(
        page.locator('[data-test="shopping-cart-badge"]'),
        "Cart badge should show 1 after adding a product"
      ).toHaveText("1");
});

test("Locked out user can not log in", async ({ page }) => {
  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(
    page.getByText("Epic sadface: Sorry, this user has been locked out.")
  ).toBeVisible();
});
});