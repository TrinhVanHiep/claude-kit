---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/test/**"
  - "**/__tests__/**"
  - "**/e2e/**"
---

# Testing Rules

Loaded automatically when touching test files.

- **Test behavior, not implementation.** Assert on observable output and UI state —
  not on internal calls, class structure, or implementation details.
- **No `.only` or `.skip` in committed code.** A focused test that ships silently
  skips the rest of the suite.
- **No `any` casts to make tests pass.** If you need to cast, fix the type.
- **Locators (Playwright / RTL):** `getByRole` → `getByLabel` → `getByText` →
  `getByTestId` → CSS. CSS class selectors are forbidden in new tests.
- **One logical scenario per test.** A test with 10+ `expect()` calls covering
  multiple flows needs to be split.
- **Mock at the boundary.** Mock HTTP calls (msw), not internal implementations.
  Avoid mocking `fetch`/`axios` directly.
- **Clean up after yourself.** `afterEach` / `afterAll` must restore global state,
  fake timers, and DOM modifications your test introduces.
- **Meaningful names.** Format: `[subject] [action] [expected outcome]`.
  "works correctly" is not a test name.
