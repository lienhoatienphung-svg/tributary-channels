# E2E Test Coverage for Stellar-MicroPay

This suite covers all major user journeys across the nine Playwright specs in `frontend/e2e/`:

- `ci-smoke.spec.ts` — fast landing-page smoke check
- `landing.spec.ts` — landing page hero, title, and wallet modal
- `dashboard.spec.ts` — unauthenticated dashboard prompt
- `transactions.spec.ts` — unauthenticated transaction history prompt
- `tip.spec.ts` — public creator tip flow
- `navbar-mobile.spec.ts` — mobile viewport navbar layout and address truncation
- `ai-assistant-shortcut.spec.ts` — keyboard shortcut (`Cmd/Ctrl+K`) and dialog behavior
- `full-journey.spec.ts` — authenticated dashboard journeys, deep links, multi-sig, notifications, and wallet states
- `visual-regression.spec.ts` — visual baseline checks for key pages

## How it works
- All Stellar SDK network calls are mocked using Playwright's `page.route()`
- Freighter wallet is mocked via `window.freighter` and `FREIGHTER_EXTERNAL_MSG_REQUEST` in `addInitScript`
- No real Horizon/Soroban calls are made

## Running tests locally

```sh
cd frontend
# Run the full E2E suite (all 9 specs)
npm run test:e2e

# Run only the fast smoke spec
npm run test:e2e:smoke

# Run only the visual regression spec
npx playwright test e2e/visual-regression.spec.ts --project=chromium
```
