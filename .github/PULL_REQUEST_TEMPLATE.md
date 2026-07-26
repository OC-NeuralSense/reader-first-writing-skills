<!-- Thanks for contributing! Please complete the checklist, especially the private-source boundary. -->

## What & why

<!-- What does this PR change, and why? Link any issue. -->

## Private-source boundary (required)

- [ ] No copyrighted source-book material is added: no book files (`.epub/.pdf/.docx/.mobi/.azw*`), no extracted or OCR'd text, no distinctive source examples, no substantial quotations, no private page/chapter locators.
- [ ] No concept-card IDs or private locators appear in any tracked/public file.
- [ ] Public prose is independently worded with original examples.
- [ ] `node scripts/guard-private.mjs` passes (it also runs as a pre-commit hook).

## Quality

- [ ] `npm run validate` passes.
- [ ] `npm test` passes.
- [ ] `npm run eval` passes (if routing/fidelity behavior changed).
- [ ] Docs updated (README / `docs/` / `docs/implementation-status.md`) if behavior or components changed.
- [ ] No overclaims (nothing labeled "published" or "Tested" end-to-end that isn't).

## Notes

<!-- Anything reviewers should know. -->
