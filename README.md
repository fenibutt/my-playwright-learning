# QA Automation — SauceDemo (Playwright + TypeScript)

End-to-end UI tests for [SauceDemo](https://www.saucedemo.com) built with
[Playwright](https://playwright.dev) and the **Page Object Model**.

## Project structure

```
├── tests/
│   ├── login.spec.ts        # login: valid, invalid, empty form, locked-out user
│   ├── cart.spec.ts         # add / remove products, reload, cart page
│   └── checkout.spec.ts     # full checkout flow + form validation
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/
│   └── users.ts             # credentials, product slugs, error messages
├── playwright.config.ts     # baseURL = https://www.saucedemo.com
├── package.json
├── .gitignore
└── README.md
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Install browsers (first time only)
npx playwright install
```

## Running tests

```bash
# Run every test in all configured browsers
npx playwright test

# Run a single file
npx playwright test tests/login.spec.ts

# Run in one browser only
npx playwright test --project=chromium

# Watch the tests run in a real browser
npx playwright test --headed

# Interactive UI mode
npx playwright test --ui
```

## Viewing the report

```bash
npx playwright show-report
```

## Design notes

- **Page Objects** live in `pages/` — each page exposes locators plus small
  action/assertion helpers, so specs read as business steps rather than raw
  selectors.
- **Test data** (users, product slugs, expected error strings) is centralised in
  `test-data/users.ts` to avoid duplication across specs.
- Locators use SauceDemo's stable `[data-test="..."]` attributes.
```
