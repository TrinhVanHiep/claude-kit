---
paths:
  - "**/auth/**"
  - "**/middleware/**"
  - "**/api/**"
  - "**/routes/**"
  - "**/guards/**"
---

# Security Rules

Loaded automatically when touching auth, API, or middleware files.

- **No secrets in code.** Keys, tokens, passwords → env vars only. Fail the review
  if `git grep -E '(password|secret|token|apikey)\s*=' --cached` returns a hit.
- **Validate at the entry point.** Every value crossing an API boundary gets schema
  validation (Zod, Joi, class-validator) before any business logic runs.
- **Auth check first.** Every handler touching user data checks auth/permission before
  doing any work. No "check after fetch" patterns.
- **No client-trusted authorization.** Never derive permissions from a value the client
  sends (userId in body, role in cookie). Use the server-side session only.
- **Sanitize before output.** User-supplied strings rendered as HTML must pass a
  sanitizer. `dangerouslySetInnerHTML` requires a sanitizer call on the same line.
- **URL allow-list.** User-supplied URLs used in redirects or server-side fetches must
  be validated against an explicit scheme allow-list (https only) and, where possible,
  a host allow-list.
- **PII ban in logs.** No email, phone, SSN, payment data, or auth tokens in logs or
  error messages passed to monitoring services.
