# 102强调单位修复独立复核

日期：2026-11-15。审者：Codex，非本页作者。
**Affected-only PASS：SOURCE-102-01 已闭合。**
仅复核 `p0102#1` 第4印刷行的两处强调；
复用 `source-review-102-103.md` 中102其余与103的PASS，不重审整页。
原首次独审FAIL与两份作者失败快照保留，不覆盖或改写。
不代表assemble、传播、现代或其它源页通过。

## 原像素与当前单位

重新实际打开102原page.png的内存局部
`[150,395,1240,180]`，原尺寸显示第4行及相邻普通字体参照，
没有再次打开整页或103。
原印“装上”后的第一个“轴承”和句末定义词“轴瓦”为粗体；
中间“轴承中和轴直接接触的零件叫做”是普通正文。

当前durable `pages/0102/page.md:50` 与
`page.json /blocks/0/lines/3` 均为：

```text
擦，就给轴装上**轴承**. 轴承中和轴直接接触的零件叫做**轴瓦**.
```

两组粗体覆盖准确，未把中间“轴承中”加粗；去除新`**`后
字句、空格、句点与修前完全相同。源强调已忠实保存，
没有用作者finalize PASS代替像素判断。

## Minimal Diff

比较 `.tmp/ld-s10y-lesson/6p/pages/0102/failure-02-missing-bold/`
与当前durable同名文件：

- MD字节级验证：当前文件严格等于修前文件只替换该一行，
  净增8个ASCII `*`；其余全部字节，包括frontmatter、notes、
  行断点及其它粗体，均未变。
- JSON结构diff仅 `/blocks/0/lines/3` 的相同两组`**`变化；
  meta及所有其它块/行/类型/open/cont/samerow均未变。
- 两处既有 `$\text{\textcircled{1}}$` 分别在首段第6行与脚注，
  修前修后完全相同；没有第二次改圈号或脚注内容。
- 当前audit与failure-02的audit字节完全相同：
  printed/md=20/20，normalizations、unknown_chars、
  katex_warnings、errors均为空。这是读取的已有结果，
  本审者未运行finalize。

failure-02的MD/JSON/audit哈希与首次独审所绑定的失败状态完全相同，
所以比较确实针对首次漏粗体快照，不是另一个被改过的中间版本。

## 图与旧失败记录未变

102原page.png哈希与首次报告一致，当前metadata的render hash同值。
图79PNG哈希与首次报告一致；meta、fig块及audit精确框仍为
`[303,878,902,272]`。
只读像素复验当前926×296裁图与原页该框外扩12px区域完全相同；
不再次进行两视图、标签或其它正文语义重审，沿用首次PASS。

failure-02未存历史图PNG，未伪称直接打开了修前裁图；
本次用首次报告的裁图hash与当前实际字节相等证明未变。

`failure-01-circled-footnote/` 三文件hash仍与首次报告一致。
旧白名单FAIL独立保留；此次只有强调单位的一次修复，
没有将圈号修复与它合并成未记录的多次修稿。

## 快照绑定

| 文件 | SHA-256 |
| --- | --- |
| 当前durable page.md | 1f760dbcb609db9d9304702642efe62a64b34ec178c6904a66ed7b75920695e1 |
| 当前durable page.json | b3275703418d6b48339486cb54a59700ed0a80eec34ba2b2b257e19844b8fc29 |
| 当前及failure-02 audit.json | 379bfafaf6a1e1cf8f42cef69945c7fa3313fad50b0e7365e6ec811ca0c5742a |
| failure-02 page.md | ce9a9d7fa07c799e93dfe1b80d614415248733e2fd2fb02b026891270b4af2c4 |
| failure-02 page.json | df9db5b0a4a28608dbc87a621d849d07155bed0f940d7f473aa2c53df53a1e5a |
| 原page.png | b056432299930af421999da90e2796cbd162460581aa13da2918da55daa5ae97 |
| 当前figures/fig-79.png | 9aa85a82ad65987d4fa66c8b7d38a8aeebb574dac4706e67cb31cb3157af7f89 |
| failure-01 page.md | 94aeba79b2e5085880821f7660710c67d6a735de3eb06ea5c330ef1c60a4c2ad |
| failure-01 page.json | 71f7e9fc9819dd7f391f2223c295fff03227dd17ed5a46a91c25e9d799387d16 |
| failure-01 audit.json | f974bbfd6c35f39b9436567cff350c198f7925928bcc7702d6ef9ee5855279f0 |

首次独审报告保留：
`source-review-102-103.md`，
SHA-256 `8d6167f8a8fbee5af531d87ea10b521035c5bf361526c647299e8394f911abc1`。
其102其余字词/图/102→103续接及103完整检查的PASS直接复用，
本次不新增103或上/下游审批。

仅用apply_patch新增本工单 `source-review-102-repaired.md`。
没有修源、回写失败报告、runfinalize/assemble、读其它源页或choices，
无DB/Git/app/依赖操作。
