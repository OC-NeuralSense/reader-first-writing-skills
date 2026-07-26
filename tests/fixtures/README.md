# Test fixtures: SYNTHETIC ONLY

Every file here is a **tiny, hand-made artifact created for this repository**. None contains
any copyrighted book content. These exist so the offline extraction/detection tools and the
test suite can run without touching real source material.

| File | Purpose | Expected result |
|---|---|---|
| `sample.epub` | Valid 2-chapter EPUB (invented prose) | `extract-epub` reports 2 html docs / 2 chapters |
| `text-layer.pdf` | Minimal PDF with a font + text-show ops | `detect-pdf` verdict: **TEXT-LAYER PRESENT** |
| `scanned.pdf` | Minimal PDF with an image XObject, no fonts/text | `detect-pdf` verdict: **IMAGE-ONLY / SCANNED** |

The `.gitignore` ignores `*.epub`/`*.pdf` globally but re-includes everything under
`tests/fixtures/**`, so these fixtures are intentionally tracked. The private-source guard
allowlists this directory.
