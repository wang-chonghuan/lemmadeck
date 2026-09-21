# STEMROBIN-144 Handoff

本次工作经过开放开发阶段；本文记录已交付并验证的结果，不记录各项编辑由哪个工具完成。

## What changed

- 前端与课程 publisher 现在接受经 FigureSpec 验证的教学图 `maxWidthPx`，PNG、SVG 和混合图层共用同一紧凑外框；未声明最大宽度的教学图保持原有尺寸。
- `ld-s10y-image` 增加教学图自然最大宽度规则，并要求宽图覆盖 390px 验收视口下实测的 331px 内容宽度。
- `phy6-c1-s4` 的图 5–10 改为 260–480px 的自然宽度，重新生成 SVG、render 和 review；图 6、8、9、10 的刻度文字按实际手机宽度重新校验。
- 已通过官方 publisher 幂等重发 `phy6-c1-s4` 到 `LEMMADECK_DATABASE_URL`。

## AC results

1. 桌面 `1440x960`：正文宽 700px，图 5–10 实测宽度依次为 320、480、280、300、480、260px；图 5 高 480px。
2. 手机 `390x844`：正文宽 331px，整页横向溢出为 0；六图均完整显示。图 5 的 PNG 与 SVG 层 `x/y/width/height` 完全一致。
3. 图 6、8、9、10 手机端最小文字分别为 16.21、16.25、16.21、16.25px；所有 FigureSpec render/review 均为 pass。
4. 对照课 `alg6-c1-s2-n5` 的未限宽教学图仍为 660px，且没有内联宽度覆盖。

附加检查：

- `check_product.mjs`：桌面、手机、打印、3 道习题及 6 张正文图通过。
- `python3 ssot-resources/audit.py`：通过。
- `python3 ssot-resources/soviet10year-textbooks/validate.py`：通过。
- `npm run test`：14 个测试文件、82 个测试通过。
- `npm run build`：通过。
- `ld-s10y-image`：22 个 validator 测试通过，Skill quick validation 通过。

## Deviations

无。开放开发没有约定的 `draft.md`；实现保持在工单 Scope 内。

## Environment

- 本地验收地址：`http://localhost:52144`
- 新增、修改或删除的环境变量：无
- 数据库结构变更：无

## Residual

无已知剩余实现问题。代码尚需按 cap4 合并并例行部署后，生产站点才能应用新的前端宽度规则。
