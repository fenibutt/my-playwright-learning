import { test, expect } from '@playwright/test';

test.describe("UI Testing", () => {

  test('login and inspect inventory', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // логин — один раз
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // проверяем, что попали на страницу инвентаря (ретраящийся ассерт)
    await expect(page).toHaveURL(/inventory/);

    const products = page.locator("[data-test='inventory-item']");

    // (если просто хочешь число для логики — то так:)
    const count = await products.count();
    console.log(`Товаров: ${count}`);

    // 2. кликнуть по второму товару
    await products.nth(1).click();

    // проверяем, что перешли на страницу товара
    await expect(page).toHaveURL(/inventory\.html/);
  });
});