# Grill

## Sources reviewed

- Plane 工单 `STEMROBIN-132`
- `.intentfold/charter/` 四文件
- `app/src/routes/_app/card.$id.tsx`
- `app/src/lib/lessons.ts`
- `app/src/lib/i18n.ts`
- `app/src/styles/app.css`
- `resources/reference/DESIGN.guide.md`
- `resources/reference/DESIGN.md`
- 历史提交 `f18b3cd` 中的 PDF 下载界面

## Settled decisions

1. **下载方式**：使用浏览器原生打印/另存为 PDF，不自动下载由代码生成的 PDF 文件。依据是用户明确要求优先使用浏览器方法、保持简单且不做后端预生成。
2. **入口位置**：复用历史 PDF 下载界面的页头右侧图标按钮、`lesson.pdf` 文案和 `.sr-icontool` 样式。该位置和组件模式已存在，不引入新的 UI 语言。
3. **文档内容**：打印当前课程标题、完整课文和全部习题，课文在前、习题在后；不打印答案、学习者输入、判分状态或应用导航。
4. **实现边界**：不调用遗留的 `getLessonPdf`，因为它依赖数据库预存 PDF；不新增依赖、后端路由、数据库字段或内容生成步骤。
5. **打印布局**：沿用课程正文的现有排版，通过打印媒体样式移除应用壳并约束 A4 分页、图片和宽表，避免维护第二套内容模板。

## Rejected options

- **继续下载数据库 `pdf` 字段**：违反“不后端提前生成 PDF”的约束，而且无法保证包含当前课程的课文和全部习题。
- **引入客户端 PDF 库**：增加依赖和独立排版路径，复杂度高于浏览器打印。
- **新增服务端 PDF 接口**：引入本工单明确排除的后端生成流程。

## Open questions

无。用户请求和既有界面模式已覆盖当前全部实质性设计决定。
