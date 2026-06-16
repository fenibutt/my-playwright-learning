import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.locator('h1')).toContainText('Playwright enables reliable web automation for testing, scripting, and AI agents.');
  await expect(page.getByRole('heading', { name: 'Playwright enables reliable' })).toBeVisible();
  await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - paragraph:
      - text: One API to drive Chromium, Firefox, and WebKit — in your tests, your scripts, and your agent workflows. Available for
      - link "TypeScript":
        - /url: https://playwright.dev/docs/intro
      - text: ","
      - link "Python":
        - /url: https://playwright.dev/python/docs/intro
      - text: ","
      - link ".NET":
        - /url: https://playwright.dev/dotnet/docs/intro
      - text: ", and"
      - link "Java":
        - /url: https://playwright.dev/java/docs/intro
      - text: .
    `);
  await page.getByRole('link', { name: 'Testing documentation' }).click();
  await expect(page.getByRole('article')).toContainText('Playwright Test is an end-to-end test framework for modern web apps. It bundles test runner, assertions, isolation, parallelization and rich tooling. Playwright supports Chromium, WebKit and Firefox on Windows, Linux and macOS, locally or in CI, headless or headed, with native mobile emulation for Chrome (Android) and Mobile Safari.');
  page.goto
});
