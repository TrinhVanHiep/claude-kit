---
paths:
  - "**/api/**"
  - "**/routes/**"
  - "**/controllers/**"
  - "**/handlers/**"
  - "**/resolvers/**"
---

# API Conventions

Loaded automatically when touching API, route, or controller files.

- **One responsibility per handler.** Parse → validate → authorize → execute → respond.
  Each step is distinct; don't nest them.
- **Validate at the entry point.** Schema validation (Zod / Joi / class-validator) runs
  at the route level before any business logic.
- **Consistent error shape.** All errors return `{ error: { code: string, message: string } }`.
  No raw strings, no inconsistent formats, no stack traces to the client.
- **HTTP semantics.** GET is idempotent + side-effect-free. POST creates. PUT replaces.
  PATCH updates partial state. DELETE removes. Use the right verb.
- **Status codes.** 200 OK · 201 Created · 400 Bad Request · 401 Unauthorized ·
  403 Forbidden · 404 Not Found · 409 Conflict · 422 Unprocessable · 500 Internal.
  Never expose internal error details in 5xx responses.
- **No N+1 in handlers.** Eager-load or batch related records — no queries inside loops.
- **Paginate every list endpoint.** No unbounded queries. Cursor-based preferred;
  offset acceptable with an explicit LIMIT cap.
- **Version breaking changes.** New breaking changes go in a new prefix (`/v2/`),
  not in the existing endpoint.
