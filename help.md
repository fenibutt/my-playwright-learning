Command	What it does
npx playwright test	Run ALL tests across ALL configured browsers (headless)
npx playwright test --ui	Open UI Mode — best for local dev
npx playwright test --headed	Show the browser window while tests run
npx playwright test --project=chromium	Run only on Chromium (skips Firefox/WebKit — faster)
npx playwright test login.spec.ts	Run only tests in this file
npx playwright test -g "login"	Run only tests whose name matches "login"
npx playwright show-report	Open the last HTML report in a browser
npx playwright install	Download browsers (Chromium/Firefox/WebKit) — one-time