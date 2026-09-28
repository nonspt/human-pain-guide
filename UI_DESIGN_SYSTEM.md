# UI / UX 设计系统

## 1. 设计哲学

清晰优先于装饰；稳定优先于新奇；可读性优先于信息密度；一致性优先于页面个性；效率优先于复杂交互。

默认气质：安静、克制、高级、可信、易理解、低学习成本。

## 2. 视觉语言

优先 Morandi 低饱和色系：灰蓝、灰绿、米白、暖灰、浅灰、柔和蓝绿色。避免高饱和科技蓝、荧光色、强烈红蓝对撞、霓虹渐变、发光边框和大面积高亮渐变。

科技感通过结构、排版、数据可视化、图标、留白和层级体现，而不是通过特效体现。

## 3. Design Tokens

每个项目先定义：

- Color：bg、surface、surface-secondary、primary、secondary、text-primary、text-secondary、border、success、warning、danger
- Typography：H1、H2、Body、Caption 及字重
- Spacing：8、12、16、24、32 等统一间距
- Radius：统一圆角等级
- Shadow：轻量、低对比阴影
- Motion：150–250ms 的状态过渡

主色只用于核心按钮、选中状态和重点数据；危险色只用于真正危险的行为或异常。

## 4. 布局与密度

推荐页面外边距 24–32px，卡片内边距 20–28px，模块间距 24–32px，小元素间距 8–16px。优先用留白、背景差异、卡片和标题建立层级，少用分割线。

普通用户页面每屏优先 3–5 个核心模块。复杂内容采用摘要 → 展开详情的 Progressive Disclosure。

页面骨架默认：Header → Page Title → Summary / Status → Main Content → Secondary Content → Primary Action。

## 5. 组件

优先复用 Button、Card、Input、Select、Modal、Toast、Tabs、Table、StatusBadge、EmptyState、Loading、ErrorState、ChartCard、InfoCard。

单张卡片尽量只承担一个主要任务。核心页面只保留一个 Primary Action。按钮文字应描述动作，例如“保存记录”“查看结果”，避免只写“确定”“继续”。

按钮高度建议至少 48px；面向中老年或患者时建议 50–56px。重要功能使用图标 + 文字，不依赖只有图标的操作。

## 6. 排版

中文优先系统中文字体、PingFang SC、Microsoft YaHei 或思源黑体。建议主标题 28–32px，模块标题 20–24px，正文 16–18px，辅助信息 14–16px；面向中老年、患者和非专业用户时正文默认不小于 18px。

页面控制在 3–4 个主要字号层级，标题通过字号、字重和间距体现，不依赖颜色制造层级。

## 7. 交互与状态

核心操作尽量 3 步以内，自动填充、默认值和历史数据复用优先。所有操作必须有反馈：成功、处理中、失败、离线、连接状态和数据保存状态都要明确。

优先 Toast、Inline Status、Progress、Skeleton；避免大量阻断式 Alert。Modal 只用于重要确认、关键输入和危险操作，按钮最多 2–3 个，取消操作容易找到。

所有数据页面都设计 Empty State；Loading 优先局部 Skeleton；Error State 必须说明发生了什么、是否影响数据、下一步怎么办。

## 8. 响应式与无障碍

默认支持 Desktop、Tablet、Mobile。桌面多列转移动端单列，侧边栏可转底部导航，复杂表格可转卡片列表。

核心导航不超过 5 项。Label 永远可见，不只依赖 Placeholder。状态不能只通过颜色表达。支持键盘、Focus、ARIA、足够对比度和 prefers-reduced-motion。

## 9. 医疗健康与 AI

医疗类产品采用 Low Anxiety Design：避免大量红色、警告符号泛滥和强烈异常视觉。数据展示顺序优先为：状态 → 解释 → 建议 → 详细数据。

AI 不默认做成万能聊天框，优先嵌入业务流程。必须区分原始数据、系统算法和 AI 辅助解释，不把 AI 建议伪装成确定性结论。

## 10. UI 验收

完成后做 3 秒测试：用户能否立刻看懂“这是做什么的”“最重要的信息是什么”“下一步做什么”。如果不能，优先重做信息层级，而不是增加装饰。
