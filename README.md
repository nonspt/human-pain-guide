# 感知身体 · iPhone 肌肉骨骼不适助手

这是独立于 3D 人体图谱的移动端原型。用户描述不适后，应用先检查危险信号，再展示可能相关的解剖区域、一般护理信息及就医提示。它不能用于诊断，也未经过临床内容审核；公开页面仅供体验和反馈，不应据此作个体化治疗决策。

## 本地运行

要求 Node.js 22.13+ 和 pnpm。仓库已包含生成的解剖概念索引，可独立安装和构建。若需要重新导入上游数据，才需将 `human-atlas-cn` 项目放在相邻目录并运行 `pnpm import:atlas`。

```powershell
pnpm install
pnpm dev
```

浏览器打开 `http://127.0.0.1:5173/`。生产构建用 `pnpm build`，输出在 `dist/`。GitHub Pages 部署由 `.github/workflows/pages.yml` 自动完成，构建路径为 `/human-pain-guide/`。正式医疗用途前须完成临床内容审核、目标地区的监管评估和真实 iPhone 验证。

## 数据与实现

- `scripts/import-atlas.mjs` 完整导入原版男性 3,432、女性 1,439 个命名概念，保存概念 ID、名称、系统及来源。它不导入三维几何文件。`src/data/import-report.json` 保存数量与源文件 SHA-256，可核查导入版本。
- `src/matcher.ts` 处理部位、侧别、否定表达及危险信号，输出可解释的结构群关联，不计算诊断概率。`src/content.ts` 保存带有外部来源的一般护理内容。模型不生成个体化治疗处方。
- 用户输入仅在浏览器内处理；只有主动保存的记录写入本机 `localStorage`。可导出纯文本或清除全部记录。应用安装到主屏幕后可离线使用已缓存的界面和索引。
- 女性数据原始覆盖有限，借用男性骨骼和另一女性腿肌的来源标记会保留。尚无足够数据支持完整淋巴系统或跨系统疼痛诊断。

## 验证

```powershell
pnpm check
pnpm test
pnpm test:browser
pnpm build
```

浏览器测试需要本机安装 Chrome，并先运行 `pnpm dev`；也可设置 `CHROME_PATH` 和 `APP_URL`。该测试使用 390×844 的移动端视口核查基本交互、危险信号、记录、横向溢出和不加载三维文件。真实 iPhone Safari、VoiceOver、离线安装及临床案例验证仍须单独完成。

完整方案与内容边界见 [开发方案.md](开发方案.md)。解剖数据署名沿用 [原项目署名文件](../human-atlas-cn/public/ATTRIBUTION.md)。

