# n47 Affected Layout Diagnosis

**SUPPORTED_BY_EXACT_DOM_METRICS**, diagnosis only. **No visual PASS.** Unique stage exited0; browser closed.

Only text .nb and choices .sr-nb/.option-text were measured. Written preview, content/math/behavior gates and option clicks were not run. Screenshots0, image views0, manual decodes0. Reserve2 LOCKED.

## Measured Cause

- Text: overflow-y computes to auto while padding is0. Six wrappers per viewport have vertical overflow. Desktop sample: scrollHeight34/clientHeight33/offsetHeight33, vertical gutter15px. After the CSS:43/43/43, gutter0.
- Choice tuples: a43px parenthesis Range exceeds a34.84375px wrapper and34.875px option-text box. Up to3.734375px above and4.421875px below is outside the viewport. Equal scroll/client heights did not disprove this.
- After the combined CSS: all12 text wrappers and49 choice containers per viewport fully contain every measured Range with exactly0px top/bottom excess. Vertical scrolling is hidden, scrollbar eligibility/gutters0.

## Exact Tested CSS

```css
p.para .nb {
  overflow-y: hidden;
  padding-block: 0.3em;
}

.preview-question .sr-nb,
.preview-option .option-text {
  overflow-y: hidden;
  padding-block: 0.3em;
}
```

Append after existing styles; existing overflow-x:auto/max-width/font-size/content are unchanged. Both wrapper and option-text padding were tested jointly; no claim that a smaller subset was validated.

## Before / After

| View | Affected | Range-outside containers | Vertical scrollbar eligible | Document height |
| --- | ---: | ---: | ---: | ---: |
| desktop-text | 6/12 | 3 -> 0 | 6 -> 0 | 960 -> 960px |
| desktop-choices | 40/49 | 40 -> 0 | 24 -> 0 | 1528 -> 1905px |
| mobile-text | 6/12 | 3 -> 0 | 6 -> 0 | 844 -> 844px |
| mobile-choices | 40/49 | 40 -> 0 | 24 -> 0 | 1698 -> 2099px |

- Document scrollWidth equals clientWidth before/after: desktop text1440, desktop choices1425, mobile390px. No page-wide sideways overflow.
- Desktop text long chain: clientWidth670 ->685px, scrollWidth697px; maxScroll27 ->12px. Both endpoints actually reached and unmasked hit-tested before/after.
- Mobile text: three long equation scrollers remain358/545,358/697,358/480px, maxScroll187,339,122px. All endpoints reached before/after, reset left.
- No horizontally overflowing choice container existed before or after at these viewports; horizontal scrolling remains enabled in computed styles.

The choices page grows1528 ->1905px desktop and1698 ->2099px mobile. Visual spacing/controls are not approved by DOM containment, and no pixels were inspected.

## Custody

Original n47-offline remains byte-identical across18 files, including its manifest; original modes remain0444/files and0555/directories. Raw PNG bytes were hashed for custody only, never decoded or image-opened.

diagnosis-evidence.json retains all BEFORE/AFTER container dimensions, computed overflow/padding, full descendant Range records, document widths and local endpoint evidence. report.json exposes all affected pairs and bounded summaries. execution/ retains actual stdout/stderr/exit. ledger.json records reads/execution/image accounting. hash-manifest.json binds all new outputs except its unavoidable self-reference and emits its SHA after freezing.

No preview/artifact/tooling/production files were modified. Parent implements the actual repair and separately releases only reserve2 for affected recovery. Original FAIL and all source/acceptance HOLDs remain. Parent must consume this technical package and actually close the reviewer.
