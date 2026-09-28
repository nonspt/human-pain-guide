# SVG 图标、表情与矢量资产规范

## 1. 强制原则

正式 UI 的导航图标、功能符号、状态图形、自定义表情、小型插图和装饰性视觉符号默认必须使用 SVG。

禁止使用系统 Emoji、位图图标、PNG/JPG 表情，也禁止混用不同来源、不同视觉语言的图标。

## 2. Icon System

统一分类：

Navigation、Action、Status、Data、Device、Medical、Emotion、Illustration、Brand

所有图标共享统一的 Grid、Padding、Stroke、Radius、Visual Weight、Color、Naming 和可访问性规则。

## 3. 几何

普通功能图标默认 viewBox 为 0 0 24 24，内部保留约 2px 安全区，主要内容位于约 20×20 范围。特殊尺寸可使用 16、32、48，但同系列必须使用相同基础 Grid。

线性图标默认 stroke-width 1.75–2，推荐统一 1.8 或 2；使用 round linecap 和 round linejoin。图标必须保持接近的黑色面积、留白、线条长度和视觉中心。

24px 图标遵循最小必要表达，避免过多细节。

## 4. 表情与状态

情绪系统使用统一 SVG，不使用系统 Emoji。建议表情使用 48×48 Grid，统一脸部直径、眼睛坐标、眼距、嘴部中心线、边缘留白和 Stroke，只改变 eyeShape、mouthCurve、eyebrowAngle、accent 等有限参数。

普通功能图标默认单色线性；状态图标可少量填充；空状态和大型插图可使用辅助色，但必须继承项目 Design System。

## 5. 色彩与组件

SVG 不随意硬编码颜色，优先 currentColor 和 Design Tokens。标准尺寸为 16、20、24、32、48、64+。

Icon + Label 默认间距 8px，紧凑组件 6px，大入口 10–12px。所有 SVG 集中维护在 assets/icons 或对应 source of truth 中，并通过统一 Icon Component 使用。

组件接口建议只允许 name、size、tone、state 等稳定参数。禁止各页面自行修改 Stroke、颜色和视觉风格。

## 6. 第三方与验收

可以参考 Lucide、Phosphor、Material Symbols 等成熟体系，但项目内不得混用多套图标库。第三方图标如不符合项目规范，应按项目 Grid、Stroke、Radius、Weight、Padding 重绘。

不使用 Icon Font，优先 Inline SVG、SVG Sprite 或 SVG Component。

新增图标必须检查：Geometry、Stroke、Shape、Weight、Color、Semantics、小尺寸显示、深色模式、ARIA 和点击区域。

纯装饰图标使用 aria-hidden；只有图标的按钮必须提供 aria-label、Tooltip 和至少 44×44px 的点击区域。
