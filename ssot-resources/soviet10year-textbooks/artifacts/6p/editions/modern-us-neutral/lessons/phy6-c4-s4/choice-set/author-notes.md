# phy6-c4-s4 choice 作者交接说明

Ticket STEMROBIN-180。仅离线作者产物，非独立review。

## 先行冻结与范围

先从技能inspect白名单读取正式ready-modern，再prepare选入原题 `1,2,3,4,g2-1,g2-2,g2-3` 与定义 `0,1,2,5`；没有解例块。原作业图108/109与定义所需107均使用正式获批durable SVG，没有新图。

`author-solution.md` 在写draft/选项前已完整求解全部7任务并落盘，先行byte SHA为
`b1766c9165a5f3feed079e347b1f05673e21c97d5d14191612827d03a3671a16`。
此后保持该文件字节不变；draft中的source_solution是同一先行解按认知单位的摘要，不以选项改写先行解。

Seed canonical SHA:
`bfc15978e52facbef95c7b2cb4d71a1c89869ce97309c9f9bf063321b4b6c532`。
Seed byte SHA:
`23dbddd1dd903d7cb191eb39ed7e5c39bba2093d9cadae73821e6ceecd14aad3`。

没有读main先行源解、答案源解、作者答案/键、旧choices、独立source-first/view-first或review文件，也不复核已通过文本/图。实际图观察仅用于读取种子，与再审批图不同；观察路径/资产SHA和306/640截图完整记在先行解。

## 认知单位

5题、20项；3multiple/2single，全部7个源任务都有coverage，不按空位或句子强制拆题。

- q1合并原定义/液面水平原因，检验液气边界、器壁接触边界及重力方向与倾斜底面区别。
- q2保持气体分子解释为完整单选因果链，不拆为三个关键词。
- q3合并水平仪名称与纸制水平仪的校准、窗台/桌面/地板检验，保留材料和源图；固定基准/双方向方法是作者提出的可行方案，不伪称源图有数值标线。
- q4核铅垂线、三角板两直角边与液面方向的完整实验关系；只作方法判断，不生成实验图冒充学生画图。
- q5核木楔调平、两方向检验、理想静止球预期与实际不动不能充分证水平的边界。

没有组合代码、全选以上、跨选项引用、孤立术语空位或新图。三种实际作业原任务仍只读保留在seed；选择式不认证剪折制作、画图、真实操作/观察。

## 明确任务损失和扩展

完整定义/分子/重力解释的自主表达有格式性损失。q1新增明示倾斜容器底面的可判断情境；模型范围仍是静止平衡、近似同外压和忽略壁边/微小起伏，不能推广到所有液面。

q3提供或选取可行的校准/检验方案，不检测实际制作、校准与三处读数记录；器具正常工作不等于被测面已水平。与名称问题合并不冒称新增独立概念覆盖。

q4损失实际放置器具和绘制完整实验图。q5损失实际调楔、轻放、观察、记录和排错。板的双方向检验与逆推边界是明确方法认知扩展，不来自源图读数，也不作为已经完成的实验记录。

图107/108没有精测刻度，图109没有球轨迹/速度。所有必要图均完整实际查看右底，使用批准资产原字节；不新增几何、渲染器输出或figure review。

## 检查与下一阶段

现有validate.py不带review的结构检查已实际执行一次，exit0，stdout为 `mechanical checks passed; semantic review still required`，stderr为空。首次结果保存在本目录 `structural-check-1.json`，没有重跑。结构exit0仅代表合同与来源一致，不是数学/任务忠实/泄漏独立PASS。

不写review.json、不进行semantic self_review、不复查main盲审。draft冻结后由main投影纯view；在main纯view判定完成前，不向main披露作者correct/rationales/source_solution。可提供seed/draft/先行解路径和SHA供冻结，但pure-view单独由main生成。

本次首次结构检查没有失败，没有修复/重试，也未创建self-review或数学PASS记录。当前作者没有授权修改题外资产、发布、DB/Git/app/服务或安装依赖。

## 最终冻结

AUTHOR COMPLETE，仅指离线作者稿和首次结构检查完成；独立source/view/key审查仍由main分阶段执行。

- Draft byte SHA: `446da50de0d8438df00217cb8c5c790e6475d8bdf74ddcd9f42272dffe8bdbbc`
- Draft canonical SHA: `2ed48ed5f2e2f5f8115e8ce786bbae7cd120e3dbc9cdd13462203583420d4a92`
- Seed、先行源解与已观察三个SVG资产未改。
- 5题20项，3multiple/2single，7/7源任务有coverage，新图0。
- 纯view尚未由作者创建；按main指示由main仅投影draft的 `id` 与 `view` 到同目录 `view.json`。这个目标路径不是已存在的作者view，作者不自行打开main投影或盲审文件。
- 不在交接消息披露correct集合、rationales或source_solution正文；这些内部文件等待main完成纯view判断后再单独授权读取。
