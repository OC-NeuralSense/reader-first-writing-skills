# Contributing

Thank you for your interest. This project has one rule that overrides all others.

## Rule 0: the private-source boundary

**Never** add, commit, or reference copyrighted source-book material. This includes book
files (`.epub`, `.pdf`, `.docx`, `.mobi`, `.azw*`), extracted or OCR'd book text, source
screenshots, distinctive source examples, substantial quotations, or private page/chapter
locators. All of that lives only in the developer's local, gitignored `development-private/`
workspace and must never leave it. See [`NOTICE.md`](./NOTICE.md) and
[`docs/private-source-workflow.md`](./docs/private-source-workflow.md).

This is enforced mechanically: `scripts/guard-private.mjs` runs as a pre-commit hook and in
CI, and release builds run package-content checks. If the guard blocks you, that is working
as designed; do not bypass it.

## Working agreements

- **Architecture is discovered, not assumed.** Do not add a skill/agent/workflow because it
  sounds useful; it must be justified by the source synthesis and survive the architecture
  review (see [`docs/architecture.md`](./docs/architecture.md)). Prefer the *minimum
  sufficient* design; merge or reject components that do not earn their existence.
- **Public prose is written from scratch** with original examples, organized by writing
  function rather than by book or author.
- **Deterministic tools emit warnings, not verdicts.** They must not claim perfect semantic
  understanding.
- **Separate production from evaluation.** The component that produces an artifact is not
  the sole judge of it.

## Developer setup

```
npm install
npm run validate      # frontmatter, schemas, manifests, private-exclusion
npm test              # unit + schema + routing tests
npm run guard         # private-source guard (also runs as pre-commit hook)
```

Install the pre-commit hook once after cloning:

```
node scripts/install-hooks.mjs
```

## Commit / PR expectations

- Keep commits scoped; describe *why*, not just *what*.
- CI must pass (lint, tests, skill/agent/workflow/manifest validation, secret scan,
  synthetic overlap check, package-content check).
- Never claim a test passed that was not run. Never claim marketplace publication that has
  not happened.
