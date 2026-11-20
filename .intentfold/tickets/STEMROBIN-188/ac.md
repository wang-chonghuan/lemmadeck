# 验证方式

## AC1
从两册 TOC 和实际 source/modern book 索引派生课程，逐课核对课文、源题、
必要图、答案、choice-set 及已有完整记录。每次只检查新增批次；
git 提交和远端 HEAD 证明小批已持久交付。无源或 HOLD 不算完整。

## AC2
新增数学/题/图按现有技能取得一次实质独立复核；
复用 hash-bound PASS，修后仅检查受影响部分。
同批用 render 和隔离 headless Playwright 在 operations 的桌面/手机尺寸确认
全文、题面、必要图、公式可见且无溢出；证明/作图保持原任务只读展示，
不把选择题通过当证明或实际作图完成。

## AC3
git diff 的产品路径仅两册；源恢复逐文件比对实际字节，不覆盖目标差异。
现有 HOLD、FAIL、来源不确定性和未知费用保留。
继承基线中的其它书册不计本单新增，不写原184目录、共享库或其它组。

## AC4
正式 handoff 时执行 engineering 的机械防线一次，记录实际结果和真实剩余项，
形成 review 分支及交付记录。不调用 publisher、merge、deploy 或关闭工单。
