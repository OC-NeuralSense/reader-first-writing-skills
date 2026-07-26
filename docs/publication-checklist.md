# Publication checklist

The human-run gate before anything goes public. `release-check` passing (see
`docs/release-process.md`) is a **precondition**, not authorization.

> **NO publication happens without explicit human authorization.** This checklist
> is completed and signed off by a person. No automation may publish on its own.

## Preconditions (must all be true)

- [ ] `release-check` green (all gates in `docs/release-process.md` §3 passed).
- [ ] Release manifest generated; packaged file set == manifest.
- [ ] Checksums recorded for every archive and the manifest.
- [ ] Version consistent across `plugin.json`, `marketplace.json`, and the
      release manifest.

## Copyright / privacy gate (hard block)

- [ ] `scripts/guard-private.mjs` clean on the full tree.
- [ ] `tools/source-overlap-guard` clean on all packaged files.
- [ ] No concept-card ids (no `BOOK-UNIT-NNN`-style patterns) in any public file.
- [ ] No book locators, no source prose, original wording only.
- [ ] `NOTICE` / `LICENSE` present and correct in each published archive.

## Honesty gate (status labels)

- [ ] No artifact labeled `Tested` without a real run behind it, with the date
      recorded in `docs/installation.md` or `docs/platform-compatibility.md`.
- [ ] The `npx github:` form stays labeled `Pending publication` until it is run
      once against the public repository, then promoted to `Tested` with date.
- [ ] Codex claims limited to what the verified spec supports: skills install to
      `~/.agents/skills`; agents degrade to sequential passes; no official Codex
      marketplace exists, and none is claimed.
- [ ] No universal-compatibility claim anywhere.

## Distinguish what is being published (check exactly what is authorized)

These are different acts. Authorize each one explicitly; do not bundle them.

- [ ] **GitHub-hosted marketplace**: repo readable so
      `/plugin marketplace add OC-NeuralSense/reader-first-writing-skills` works.
- [ ] **Local plugin install**: docs correct; no publish action required.
- [ ] **Public marketplace listing**: a curated published entry. Authorize
      separately; not implied by having `marketplace.json` in the repo.
- [ ] **Generic / skills-only distribution**: archive available; manual install
      docs correct.
- [ ] **Codex/OpenAI hosted bundles**: only if the format is verified; otherwise
      hold.

## Authorization

- [ ] A named human has reviewed this checklist and the release-check output.
- [ ] The human has explicitly authorized publication, naming **which** of the
      acts above are approved.
- [ ] Authorization, date, version, and approved acts are recorded (e.g. in
      `CHANGELOG.md` / the release record).

Authorized by: ____________________   Date: ____________   Version: __________

Approved acts: _______________________________________________________________

**If any box above is unchecked, do not publish.**
