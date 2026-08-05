# University Frontend Instructions

Conditional implementation, verification, and live-system procedures use the global `$verify-project-change` and `$operate-live-system` skills.

- This is the GradAbroad university-facing Next.js App Router dashboard.
- Read `package.json` and reuse existing patterns under `app/`, `components/`, `hooks/`, `lib/`, `messages/`, and `types/`.
- Backend permissions are authoritative. Scope candidate, programme, scholarship, and document access to the signed-in university and handle denials explicitly.
- Treat candidate records, tokens, and signed document URLs as sensitive; do not leak them through logs or broad client caches.
- Preserve localization and accessibility. Run `npm run lint` and `npm run build`; use browser evidence for changed workflows.
- A push to a production branch may publish and deploy an immutable image; require explicit authorization and inspect the infrastructure runbook first.
