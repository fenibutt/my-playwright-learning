import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { standardUser, lockedOutUser, invalidUser, errors } from '../test-data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('logs in successfully with valid credentials', async () => {
    await loginPage.login(standardUser.username, standardUser.password);
    await loginPage.expectLoggedIn();
  });

  test('shows an error with wrong credentials', async () => {
    await loginPage.login(invalidUser.username, invalidUser.password);
    await loginPage.expectError(errors.wrongCredentials);
  });

  test('shows an error when the form is empty', async () => {
    await loginPage.loginButton.click();
    await loginPage.expectError(errors.usernameRequired);
  });

  test('blocks a locked-out user', async () => {
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);
    await loginPage.expectError(errors.lockedOut);
  });
});
