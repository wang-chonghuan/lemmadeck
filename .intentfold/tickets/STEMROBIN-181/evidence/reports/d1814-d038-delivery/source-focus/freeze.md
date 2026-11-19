# STEMROBIN-181 Focused Pixel Freeze

Independent affected review, 2026-11-19. This source freeze was written before
opening candidate page artifacts or previous findings. Six source crops viewed
once each; no other source images or reopens. Coordinates are [x,y,w,h] in the
named page PNG. All six crop and three source-page hashes match crops.json.
Manifest SHA-256: 7f0afdbcfd9cc39ecf2e2ed29992fcdcf7b67bc2f8b908e4cde4fd8dc52fc4ff.

1. U278-PUNCTUATION, p278 [615,1080,345,110].
   Visible focal text: `平面上．所以从狭`.
   Separator after `上` is a solid baseline full stop, not a comma, semicolon,
   or hollow Chinese circle. `．` here represents that visible glyph.
   Crop SHA-256: aec34c84b08feb046a4e0f5c7236512f5a635e1d89531858f23bb8c34ce6f614.
2. U279-PLATE-I-V, p279 [850,580,250,100].
   Reference reads `彩图 V, 1`; the Roman letter is V (two converging strokes),
   not I. Parenthetical closure and a solid full stop follow the reference.
   Crop SHA-256: 1480f857b2284ce8fd65c8f3a98ea460bf176bbcdf10ac4a4e2e65a768fdfe5d.
3. U279-SECOND-SENTENCE-EMPHASIS, p279 [180,1240,900,220].
   Complete heating sentence: `为了获得连续光谱，需要把物体加热到高温．`
   This sentence is body weight, not the heavy bold of the adjacent preceding
   `实验表明，连续光谱是由处于固态或液态` fragment. The following
   `连续光谱的特征以及它的存在不仅是由各` fragment is also body weight.
   The neighboring sentences continue beyond the crop's right edge; this
   freeze does not reconstruct those missing endings.
   Crop SHA-256: 710c54b8efb59579d89657a9d4b742555c11a4267213c170fc2ecd9042d8e36c.
4. U280-FIRST-PARAGRAPH-READING, p280 [210,280,520,120].
   Focal wording is `勉强能辨别出`, in the visible fragment
   `火焰的勉强能辨别出连续光`. Preserve `勉强`; do not substitute a more
   fluent or semantically expected expression. The full sentence begins left
   of and continues right of this crop; only the focal wording is frozen.
   Crop SHA-256: ff9470683be1c37e0eb8c03d44ec0d0279a020a688cb51ba7ccd27b294ba2a4c.
5. U280-XIA-READING, p280 [180,1080,570,100].
   Focal fragment: `种情况下实际上是没有相互作`.
   The glyph between `况` and `实` is 下, not 不 or another character.
   The initial qualifier and sentence ending lie outside this crop.
   Crop SHA-256: 90170d4e98238e7bf7fde84a09e68cd14046cd9bb67d9df4262032e49f329656.
6. U280-PARENTHETICAL-EMPHASIS, p280 [180,990,1080,180].
   Parenthetical words: `而不是分子`. All five words/characters are heavy
   bold, like the preceding `所有物质的气态原子`; bracket strokes are lighter.
   The parenthetical words must not be left outside the emphasis span.
   This freeze adjudicates that parenthetical site, not unrelated typography.
   Crop SHA-256: 0dcc11e09699643e4024e8d921e2c8ed7abdb596408ffa48c0acee23f8553c7f.

Source-page SHA-256 bindings:

- p278: b9391b0f967bcc8d3a50672955693d1725191e70e5971419ad93c1296db13271.
- p279: 6c25de8179496e192a7d24300eb762288a62acd0bd9f22ddcbb64970fa622f89.
- p280: 17d0d03e965e17c3890df3605862c0d76de4b92410b01f223af5e5f862fe3fbd.

## Repaired RAW Freeze

Written after the one permitted repaired RAW view, still before any candidate
or previous finding was read.

- Path: `.tmp/ld-s10y-lesson/10p/pages/0278/figures/fig-231.png`.
- SHA-256: 76fd6169249e13561efe6d1018df61a458823a5b818f407767bed6d0ffb16ba8.
- Inventory: one left slit/source point at a break in the left outline;
  divergent incoming rays with arrowheads; a first hatched convex lens labelled
  L with subscript 1; a triangular, internally hatched prism labelled P; a
  second hatched convex lens labelled L with a small subscript (apparently 2;
  exact subscript reading is not used as evidence for the padding repair);
  ray segments and arrowheads through/beside the prism and second lens; rays
  ending at two distinct locations on the right screen; upper label `红` and
  lower label `紫`. The left rectangular outline, central curved upper/lower
  enclosure contours, and right tilted screen/enclosure outline are present.
  No scale, numerical measurement, caption, or neighboring body line is visible.
- Boundary: the left source/slit junction, both complete lens outlines, prism
  apex/base, curved enclosure, full right screen including its top/bottom ends,
  and both Chinese labels remain inside the image. White clearance is visible
  at all four outer edges. No apparatus ink is visibly cut; no foreign text
  fragment remains. The supplied repaired RAW passes this boundary-only review.
- The user supplies padding 5 and unchanged snapped box [482,757,540,215].
  This view verifies the resulting image, not a before/after pixel comparison.
- Actual final image count: 7 (six source crops plus one repaired RAW),
  each viewed once; zero other images or reopens.
