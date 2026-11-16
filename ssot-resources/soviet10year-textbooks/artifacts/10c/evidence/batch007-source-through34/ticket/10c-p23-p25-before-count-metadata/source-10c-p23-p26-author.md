# 10c physical23–26 忠实源层作者交接

身份：本单源作者，非独立审者；后续独立审查由Dalton承担。仅四页前置源稿，不装订，不扩展当前稳定索引，不计作第六批完整课。

## 路径与偏移

已完整阅读当前 `.claude/skills/ld-s10y-lesson/SKILL.md`，读取 `profiles/soviet-cn.json` 与实际 prepare/finalize 入口。`sources/manifest.json` 的10c记录直接指向 `sources/soviet10years/10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`，369物理页；PDF SHA256 `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`。prepare使用1-based物理页，不套用几何册偏移。只读物理22页尾文，页脚16；实际物理23页完整原PNG页脚17，当前段偏移+6。

每页顺序为 prepare一次 -> 单张完整原PNG -> 该页网格 -> 冻结观察 -> apply_patch忠实MD -> finalize一次。机器结果不作为观察行数的权威，不用expected override、count_exclusions或正文像素mask。不处理旧18г/r及旧题50区间，不读取答案/choices，不动7–22页、工具或book索引。

## p0023：原图观察先于转写

- prepare实际命令：`.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 23`，exit0；1695×2580@300dpi，未遮图machine24行。
- 已分别实际打开完整 `page.png` 与 `page.grid.png`。原PNG SHA256 `b2f092cd2bac82542ace677f942429734af5a04379c5499cb62c0082b006ca86`。
- 本页属80“谐振动的微分方程”续课，不新增标题。首段独立起段，末段“换句话说……服从/于方程”open到下一页。
- 横排冻结：首段3；三角印记引导的弹簧分析段8；图10/11图题同一横排1；力与加速度段3；二阶导数段3；末段2；页脚1，总21。图内轴字及弹簧不是正文行。
- 公式完整保留 `$f''(t)=-cf(t)$` 与编号(1)、`$F=-kx,$`、`$ma=F.$`、`$ma(t)=mx''(t)=F=-kx(t).$`。段首实心右三角以 `\blacktriangleright` 记录，不增标题。
- 图10：左装置完整两固定端、两组弹簧和居中小球；下方横轴右箭头、原点竖记及0、右端x。粗框 `[380,1200,420,265]`，图题单独。
- 图11：右装置完整固定端/弹簧、小球向右移；下方轴0及位移x竖记、右端x。粗框 `[945,1200,425,265]`，图题单独且samerow。
- 顶边横迹、底边细线和左缘零散黑点保留原PNG；没有把它们转成正文，也不登记计数排除。
- finalize实际命令：`.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 23`，唯一一次exit1；10块/MD21行/machine22行，图2张，normalizations0。仅错误为“行数对不上：印刷22行，块体21行”；unknown_chars、katex_warnings、count_exclusions均空。不修稿、不重跑、不自批。
- 两张实际吸附crop已各自打开，装置、坐标轴和全部轴字完整：fig-10 `[383,1201,405,247]`（9连通域），fig-11 `[947,1204,417,244]`（14连通域）；无图题混入crop。它们留在官方scratch `.tmp/ld-s10y-lesson/10c/pages/0023/figures/`，不提升到figure库。
- finalize生成的持久文件保留首次FAIL原字节。SHA256：
  - page.md `91b61ba004f64137b18f89e3ec44c38ec2b9a1ecc51ac0d3c999ac79ab1b505a`
  - page.json `7d1fe15b2a0e9330b3bfcb848f097d513fae358632f9b2fcfbf652e3887428f3`
  - audit.json `48a00ea00515ccc3968812456da7bed935fc8e8961146c2b1845c4fd8e20a148`
  - page.grid.png `da87d0ee1b0b1ec966481674201ab54800443b23b71bcd8f2ee144930af8994e`
  - fig-10.png `f51e919518420811f91d74e077f174442ec2acdb35346a21914f7a96329b91ef`
  - fig-11.png `4d30e4fe5c3590cc51cc90dace7b72e43a0ccfd23bfd56c6d50805c0b7aa135a`

## p0024：原图观察先于转写

- prepare同官方命令，仅page=24，唯一一次exit0；1695×2580@300dpi，未遮图machine24行。完整原PNG及网格分别已打开；原PNG SHA256 `47fd3f37eb74d76e56ea798d46f3fb7e72f1e7b66f437327bf8902d8831568bc`，页脚18。
- 无图/图题/新标题/习题。本页有10文本对象；首p cont2行、通常说p2、注p2、怎样p2、公式(2)及验证p5、由(2)(4)p2、其中c p2、反向陈述及(7)p4、末p open1、foot1，实际总23横排。
- 页首完整 `$x''(t)=-\frac{k}{m}x(t),$` 承接23末句，分子/分母不拆行；左指三角结束前页力学说明。公式(2)–(7)、一阶/二阶导数、正常数c、实数集合R、`$\omega=\sqrt c,\ A\geqslant0,\ \varphi\in[0,2\pi[$` 全保留。
- 末句仅“证明微分方程（1）的任一解具有（2）的形式超出中学教科”，open；不补“书”或证明。右缘约x1580–1610零散墨点、底边约y2460–2490长细线可见，保留原PNG，无排除框。
- finalize同官方命令，仅page=24，唯一一次exit1；10块、MD23/machine24、图0、normalizations0。仅行数错误“印刷24行，块体23行”；unknown_chars、katex_warnings、count_exclusions空。完整FAIL保留，不改、不重跑。
- SHA256：page.md `d75c66f6f119327cc46bb72b3cdf6cffeafda046987a0b0010657c199401bd0c`；page.json `0a5aaee6d6371304187e0f9fc524d5d7f33d540e7389b50115ed4cdaba20b22c`；audit.json `0136d5888fcf30fefc24995b70e30fa087d97a6131ddd70120bfc847dc897393`；page.grid.png `7deb1d77308f7408e768246bb7e7a2a446d37b7f0238af66c247fa173f193fb6`。

## p0025：原图观察先于转写

- prepare同官方命令，仅page=25，唯一一次exit0；1695×2580@300dpi，未遮图machine25行。完整原PNG与网格分别已打开；原PNG SHA256 `597d669b9b3c8a8abac3b6d53a27e5c35c7bf8e81150b7dc60b6537c28e64019`，页脚19。
- 无图/新标题/习题。8对象：首p cont1；因此p1；振幅/周期/频率/初相p7；回到小球p5；初始条件p6；由(8)(9)p open1；foot note2；foot1。正文/公式21 + 教学脚注2 + folio1 = 24真实横排。
- 原定义及A=0的例外、`$T=\frac{2\pi}{\omega}$`、式(8)、`$\omega=\sqrt{\frac{k}{m}}$`、任意A/phi、起始时刻t=0、式(9)全部保留。两条初始值方程印作上下两排、无左括号，共有编号(9)居中；aligned+一个真实`↵`记录双排，没有合并成单排凑数。
- 首行“书的范围$^{*}$.”承接24页，星号对应底部教学脚注。脚注两行按原排保留，限制A及原区间不变；约 `[230,2090,485,12]` 的短分隔线不是字符/正文行，不做图对象也不登记排除。
- 末p只有“由（8）和（9）得到：”，open承接26；没有提前补公式。底部约y2490细线和左缘散点只保留原PNG。
- finalize同官方命令，仅page=25，唯一一次exit1；8块、MD24/machine25、图0、normalizations0。仅错误为行数“印刷25行，块体24行”；unknown_chars、katex_warnings、count_exclusions空。保留完整首次FAIL，不删脚注、不改真实换排、不重跑。
- SHA256：page.md `d288be73e121b03f67c6dee2d308d64f786775551c5c7f3754eafd8d8d9dd697`；page.json `a301516bee69f39a82f6ce69c22d6fb367f6f2097fcb3050655696cdebf8afb7`；audit.json `1521154f61eb559da587b6f484db229b47f364652ff33ff8e699f44c5fd2038d`；page.grid.png `e0a9caebbb993d432fc06c8816f96d00599fad80024a8cdf1f8b261b0b6e45c1`。

## p0026：原图观察先于转写

- prepare同官方命令，仅page=26，唯一一次exit0；1695×2580@300dpi，未遮图machine23行。完整原PNG与网格分别已打开；原PNG SHA256 `bf022335af80cf286a6b933ef4dc1dfc505726d130d92f9ee009bc6ffa83c55e`，页脚20。
- 无图/新标题/习题。10对象：首p cont2；把方程组p3；我们看到p2；常数/向量p2；便于求phi p3；小球结论p1；唯一解初始条件p3；任意t0 p5；foot note1；foot1。正文/公式21 + 教学脚注1 + folio1 = 23真实横排。
- 方程组(10)/(10а)各两横排，均有左括号；完整cases中各一真实`↵`，不把分式子行算成新横排。(11)平方根包含两平方和、(12)保留原tg及全部分母；未补公式适用条件。保留第90小节/第259题引用、c>0及两对初始条件，最后公式以句点结束，没有为未知下页伪造open。
- 源字形局限明确保留：式(10а)A上方小墨点不足以认定点导数；原r按可见箭头作`\vec{r}`，不以旧18页未决glyph校这里；公式编号字母采用soviet-cn的Cyrillic а（U+0430）约定，不冒称像素可区分码点。
- 新源内部疑点仅登记待独立确认：式(10а)有`$-\frac{v_0}{\omega}=A\sin\varphi$`，下方向量说明两处可读像素均为正`$\frac{v_0}{\omega}$`。本稿保持该差异，不用一般数学结论补源负号，不宣告已批准的erratum，frontmatter errata=[]。
- 脚注为一完整横排，短分隔线约 `[150,2160,490,14]`；右缘x1580–1610墨点及底边y2480–2500细迹保留，不记count_exclusions。
- finalize同官方命令，仅page=26，唯一一次exit0；10块、MD23/machine23、图0、normalizations0。errors、unknown_chars、katex_warnings、count_exclusions均空。此仅官方页级机械PASS，不是作者独立批准。
- SHA256：page.md `e8530f0b51790e9b0d127ae8a3c47fd9959c41d9db24815eb7336a2ee18ac71e`；page.json `c4df28b46c4fc33ac3ff8ca228aa56b7c1a101377743a34b1bfad57d9d9c2c39`；audit.json `797731462d5357d322b1c670970c24496ccac12d8f23fb19a369b82e0bf076c9`；page.grid.png `14427ae70c2426f3f9fcf09f65cc945c96d64151ce3e5f840e8e1f0cc4dd402e`。

## 不可变交接汇总

|物理/印刷页|对象|真实观察/MD横排|首次finalize machine/MD|exit|状态|
|---|---:|---:|---|---:|---|
|23/17|10|21|22/21|1|countFAIL原样保留|
|24/18|10|23|24/23|1|countFAIL原样保留|
|25/19|8|24|25/24|1|countFAIL原样保留|
|26/20|10|23|23/23|0|仅机械PASS，待Dalton|

共38对象，忠实MD91横排；图10/11只有两crop，其他三页无图。本单没有新增书写题或小节标题，80课仍只是未来装订前置内容，不把26页末完整句点当作整课已闭合。

续接绑定：`p0023#9 open -> p0024#1 cont`；`p0024#9 open -> p0025#1 cont`；`p0025#6 open -> p0026#1 cont`。教学foot note分别为p0025#7和p0026#9，透明但正文内容必须保留；p0026#8以完整初始条件公式和句点结束，无人为open。未读取27页。

实际执行仅如下8条官方命令，每条一次，按列出的顺序执行；每页prepare后原PNG、网格及转写完成才执行该页finalize：

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 23   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 23  # exit1, 22/21
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 24   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 24  # exit1, 24/23
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 25   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 25  # exit1, 25/24
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 26   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 26  # exit0, 23/23
```

持久源稿位于 `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0023/` 至 `0026/`，每页有完整page.md/page.json/audit.json；上述逐文件SHA绑定当前完整原字节，非仅哈希替代失败稿。原PNG/网格/初次prepare模板/layout和两张实际crop留在 `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/10c/pages/0023/` 至 `0026/`。

所有首次FAIL都在原文件中完整保留；没有后续修稿、二次prepare/finalize、人工count覆盖或count_exclusions。没有修改工具/既有7–22页/源索引/book.json，没有assemble/vectorize/adapt、现代图/答案/choices/网络/浏览器/Git/DB操作。本报告是作者handoff，未记录独立review PASS；停止等待Dalton。
