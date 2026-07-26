# Private-source workflow (clean-room)

How copyrighted source books are handled during development so that **no protected
expression ever enters the public repository, release archives, or user distributions.**

## Principle

Only non-copyrightable **ideas, facts, and methods** may influence the design; they are
re-expressed **independently**. Copyrightable **expression** (exact wording, distinctive
examples, tables, diagrams, exercises) is never reproduced. The books are private study
sources, not runtime dependencies.

## The boundary

Everything source-related lives under `development-private/` (gitignored):

```
development-private/
├── sources/        # the book files themselves (never leave this machine)
├── tools/          # offline extraction/detection tools (extract-epub, detect-pdf, extract-docx)
├── extracted/      # source-derived plain text (private, never committed)
├── ocr/            # OCR output, if ever used (private)
├── concept-cards/  # abstract principle cards (Stage C), private
└── traceability/   # concept-to-capability, source-coverage, unresolved-tensions (private)
```

## Enforcement (defense in depth)

1. **`.gitignore`** excludes `development-private/`, all book/binary extensions
   (`.epub .pdf .docx .mobi .azw*`), and extraction/OCR outputs.
2. **`scripts/guard-private.mjs`** runs as a **pre-commit hook** and in **CI** (`--all`),
   blocking any staged/tracked path that matches a forbidden rule and scanning tracked text
   for private filename/locator signatures. Never bypass with `--no-verify`.
3. **CI** additionally greps the tracked file list for source binaries.
4. **Release** builds run package-content checks and a synthetic **overlap check** before any
   archive is produced.

## Stages (from the spec)

- **A: Extraction.** Read local files only, in `development-private/`. Detect whether a file
  is lawfully readable; **stop** rather than bypass any protection. Preserve chapter/page
  locators **privately**. Do not launch uncontrolled full-book OCR.
- **B: Source inventory.** Per section: problem addressed, concepts, definitions,
  procedures, diagnostics, heuristics, exceptions, scope, limitations, relationships. No long
  passages copied.
- **C: Abstract principle cards.** Convert inventory into abstract, independently-worded
  cards (schema in the spec). Marked with `public_expression_status` flags
  (`independently_worded`, `original_example_created`, `overlap_checked`, `human_reviewed`).
- **D: Cross-book synthesis.** Concept matrix; tensions encoded as decision rules.
- **E: Public methodology.** Written from scratch, organized by writing function, original
  terminology and examples, conditions and exceptions preserved.

## What must never happen

Commit/redistribute a book file, extracted text, OCR output, screenshots, tables, diagrams,
exercises, substantial quotations, or a chapter-by-chapter substitute · package a source into
any skill/plugin/release/vector store/model context · expose private locators or filenames in
public content · bypass DRM or any technical protection · use author names in any
plugin/skill/agent/package/repo name.
