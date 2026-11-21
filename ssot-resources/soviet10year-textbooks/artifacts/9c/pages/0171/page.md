---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 171,
  "printed_page": 164,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 171
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "73a07ae7b609aa2c69f16aecae7610e8daadd74c031c59e18802c5d2609e2a98"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "SOURCE171 finish=review only; first independently frozen literal body remains byte-identical.",
    "Independent source freeze precedes layout/template/counts and canonical170 continuity.",
    "Incoming source fragment contains two subrequests and no number. ex cont intentionally has no printed label; canonical physical170 final ex 387 open supplies continuity identity only, not new source ink.",
    "Wavy underlines under R11 复合函数, R12 first 映射, R13 复合映射 are recorded in source-inventory.json, not invented textual markers.",
    "Four right-margin blobs and sparse scan speckles remain in source pixels and inventory; no count exclusions or provenance approval.",
    "Final display independently read as D(g)=R_0=[0,infinity[; no added plus, silent mathematical correction or unseen continuation.",
    "Folio dots use middle-dot encoding; exact dot codepoint/font and punctuation width remain HOLD.",
    "Last prose object remains open;172+ UNREAD/UNPREPARED/NOT PREFETCHED; no lesson/course approval.",
    "SOURCE170 qualified retention and all prior FAIL/HOLD/UNKNOWN remain unchanged."
  ],
  "errata": [],
  "continuation_bindings": [
    {
      "candidateBlock": "ex#1",
      "kind": "ex",
      "sourceNumberOnThisPage": null,
      "predecessorPrintedExerciseNumber": "387",
      "predecessorCanonicalPath": "ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0170/page.md",
      "predecessorCanonicalSha256": "d5c26dcbd7bd5708f46cd69249bbe2c3bd2dbe5b0e806b4737b331d99249addb",
      "predecessorTailHeader": "<!-- ex 387 open -->",
      "basis": "Only canonical170 final open object TEXT read after independent source freeze",
      "candidateBodyUnchanged": true
    }
  ],
  "source171_evidence": {
    "source_body": {
      "path": ".tmp/stemrobin-184-six/source171-active/source-body.md",
      "bytes": 1158,
      "sha256": "4af383739c3d863dc8fac05eb95801f2d9942104b4d9f35381436b70b1db019c"
    },
    "source_inventory": {
      "path": ".tmp/stemrobin-184-six/source171-active/source-inventory.json",
      "bytes": 10999,
      "sha256": "b67d38300dbe21a00c08f7be18626de035ba70c041aeb0a40312303ae68307dd"
    },
    "source_freeze": {
      "path": ".tmp/stemrobin-184-six/source171-active/source-freeze.json",
      "bytes": 748,
      "sha256": "efbc2c8d4a916c582a5b311f0687ffa4cc85968c31c0dc21f34de101fa1d59d7"
    },
    "row_mapping": {
      "path": ".tmp/stemrobin-184-six/source171-active/row-mapping.json",
      "bytes": 12026,
      "sha256": "5a922b2021226693830651adb933701c25de2121508f3585d4416b3b3ebd2bbd"
    },
    "original_png": {
      "path": ".tmp/ld-s10y-lesson/9c/pages/0171/page.png",
      "bytes": 79177,
      "sha256": "73a07ae7b609aa2c69f16aecae7610e8daadd74c031c59e18802c5d2609e2a98"
    },
    "strict_glyph_approval": "HOLD",
    "mathematical_approval": "HOLD",
    "lesson_completion": false
  },
  "printed_lines": 24,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex cont -->
а) $y=2x+\frac{1}{x^2}$；　б) $y=\frac{2x}{1+x^2}$.

<!-- h3 -->
49. 复合函数

<!-- p -->
我们已经遇到过复合函数. 例如，当计算函数
$h(x)=\sqrt{1-x^2}$
的值时，首先对给定的 $x$ 计算函数 $f$ 的值：
$f(x)=1-x^2$，
然后由这个值 $y=f(x)$，求出函数 $g$ 的值：
$g(y)=\sqrt{y}$.
函数
$h(x)=g(f(x))$　(1)
就是由函数 $f$ 和 $g$ 构成的复合函数.

<!-- p -->
函数也叫做映射. 公式(1)定义的映射 $h$ 叫做 $f$ 和 $g$ 的
复合映射，并表示为
$h=g\circ f$.

<!-- p -->
在中学几何课本里使用的就是这种术语.

<!-- p open -->
复合函数(1)有什么样的定义域呢？显然，这个定义域
$D(h)$ 应当包含在函数 $f$ 的定义域里；不然就不能根据 $x$ 确定
$f(x)$ 的值，而这是利用公式(1)所必须的. 但是 $D(f)$ 中的 $x$，
只有当 $f(x)$ 属于 $D(g)$ 时，它才属于 $D(h)$. 在我们的例中，
$f(x)=1-x^2$，　$g(y)=\sqrt{y}$，　$h(x)=g(f(x))$.
函数 $f$ 的定义域是整个数直线 $R$. 但是，为了使 $f(x)$ 的值在
$g$ 的定义域：
$D(g)=R_0=[0,\infty[$

<!-- foot -->
· 164 ·
