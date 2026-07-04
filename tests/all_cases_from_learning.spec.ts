import { test, expect } from "@playwright/test";       // 1. Import tools
import { validUser, getLoginUrl } from "../test-data";

test.describe("Login page", () => {                     // 2. Group of related tests

  test.beforeEach(async ({ page }) => {                 // 3. Runs before EVERY test
    await page.goto("https://example.com/login");
  });

  test("should show error for wrong password", async ({ page }) => {  // 4. One test case
    await page.getByPlaceholder("Email").fill("user@test.com");       // 5. Type into field
    await page.getByPlaceholder("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();        // 6. Click button

    const errorMessage = page.getByText("Invalid credentials");       // 7. Find element
    await expect(errorMessage).toBeVisible();                         // 8. Assert it's visible
  });
});

test("cart badge appears after adding product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← something missing here

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test("test data is wired correctly", async () => {
  const { email, password } = validUser;
  console.log("URL:", getLoginUrl("staging"));
  console.log("Email:", email);
  console.log("Password:", password);
  // Does it print what you expect?
});

// POSITIVE test — checks that something IS as expected
test('page has the correct title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

// NEGATIVE test — checks that something is NOT present.
// In QA, this is just as important as positive checks.
test('page does not contain error text', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // .not.toBeVisible() = assert the element is NOT visible on the page
  await expect(page.getByText('404 Page Not Found')).not.toBeVisible();
});

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