# 网站维护指南（供后续智能体使用）

本仓库是李伟凯的 GitHub Pages 学术主页：<https://cavin-lee.github.io/>。请先阅读本文件和 `README.md`，再修改内容。用户在当前任务中的明确要求优先于本文件。

## 页面与文件

| 文件或目录 | 用途 |
| --- | --- |
| `index.html` | 英文首页，网站根路径 `/`。履历简介、职称、单位、研究方向卡片等静态文案在这里。 |
| `cn/index.html` | 中文首页，路径 `/cn/`；与英文页保持内容对应。 |
| `en/index.html` | 旧 `/en/` 地址的跳转页，指向英文根路径。 |
| `data.js` | 两种语言共用的结构化内容：论文、教育、项目、学术服务、个人荣誉、学生获奖和新闻。 |
| `app.js` | 首页内容渲染、论文筛选及展开、学生获奖按年折叠。 |
| `styles.css` | 两个首页的视觉样式。除非用户要求，延续现有风格。 |
| `cv-builder/` | 可勾选条目的简历生成器；`builder.js` 使用 `data.js`，`builder.css` 规定打印 A4 页面。 |
| `assets/` | 公开下载文件。`papers/` 为论文，`awards/` 为获奖材料，`projects/` 为项目证明，`service/` 为学术兼职证明。 |
| `scholar-publications.json` | Google Scholar 论文记录的本地快照；当前快照日期为 2026-10-03。 |
| `missing-papers.md`、`assets/missing-papers.pdf`、`assets/missing-papers.xlsx` | 尚未找到可确认匹配全文的论文清单，论文变动时应同步更新。 |

本站没有前端构建步骤。GitHub Pages 从 `main` 分支根目录发布；`.nojekyll` 已存在。

## 已确认的内容与展示规则

- 英文首页是 `/`，中文首页是 `/cn/`。两个版本的链接、姓名、单位和重点经历应一致，文字分别用自然的英文和中文表达。
- 首页职称顺序为“教授 · 博士生导师 · 泰山学者青年专家”；英文对应为 “Professor · Doctoral Supervisor · Taishan Scholars Young Expert”。单位包括山东建筑大学计算机与人工智能学院、重庆交通大学数学与统计学院、全景医学影像中心；邮箱为 `leeweikai@sdjzu.edu.cn`。
- 《Aging & Disease》《Brain-X》《Cog》《Artificial Intelligence Science and Engineering》分别列为一条“青年编委”，不要合并成一条，也不要改成泛称“编委或青年编委”。中文期刊名称统一加《》；CPSI 2026 联合程序主席和 CPSI 2027 程序主席分别列在会议与论坛中。
- 《Frontiers in Neuroscience》《Frontiers in Aging Neuroscience》《Frontiers in Cell and Developmental Biology》《Frontiers in Pharmacology》客座主编按期刊分别列出，不合并为“等期刊”。
- 论文以[李伟凯的 Google Scholar 主页](https://scholar.google.com/citations?user=XEfV8mkAAAAJ&hl=zh-CN)为准。按研究方向归类；每个方向默认显示最新 5 篇，其余保留在展开列表中。全文只有在与 Scholar 记录核对匹配后才能加下载链接。没有全文时保留论文记录，并更新待补清单。
- 首页“研究方向”的五个标题必须与 `data.js` 中 `areas` 的中英文分类名称一致；“学术经历”保留既有概括，不要因为调整方向卡片而重写履历。
- `app.js` 以运行时年份计算最近 5 年的学生获奖，按年份从新到旧排列；每年默认显示 3 项，其余展开查看。历史记录仍保留在 `data.js`，不要为实现折叠而删除数据。
- 简历生成器允许自由勾选教育、项目、论文、学术服务和获奖；各章节的数字序号从 1 开始。浏览器打印样式使用 A4，用户可在打印窗口保存为 PDF。
- 截至 2026-10-04，主页收录 Google Scholar 论文 80 篇，其中 33 篇有本地全文、47 篇待补；指导学生获奖 21 项。这些数字是当时快照，更新时重新核对。

## 更新数据的方法

`data.js` 的顶层对象是 `window.SITE_DATA`。多数可翻译文字使用 `{ "zh": "…", "en": "…" }`；论文题名、引文通常直接用字符串。文件链接写成以站点根目录为基准的 `assets/...` 路径；`app.js` 会处理中文子路径，不要把 `/cn/` 拼进材料路径。

- **论文**：在 `publications` 中维护 `title`、`year`、`citation`、`area`、`scholar`，确认有全文后才加 `file`。`area` 必须是 `areas` 中的键。更新 Scholar 记录时也更新 `scholar-publications.json` 和三种待补清单。不要仅凭相似文件名匹配论文。
- **项目**：在 `projects` 中维护双语 `title`、`funder`、`role`；批准通知或任务书放进 `assets/projects/`，以 `files: [{"path":"assets/projects/…pdf","label":{"zh":"…","en":"…"}}]` 关联。
- **学术服务**：在 `service` 对应分组的 `items` 中增加独立条目；有聘书时用 `file` 指向 `assets/service/`。期刊任职逐刊列出。
- **个人或学生获奖**：分别修改 `personalAwards`、`studentAwards`。每项含 `year`、双语 `title`、`files` 数组，可选双语 `note`。依据证书文字核对赛事名称、级别、年份和指导教师；不要只按源文件名判断。新增学生获奖后，简历生成器会自动出现对应复选框。
- **新闻**：在 `news` 增加 `year`、双语 `title` 和 `detail`、`file`。新闻引用的证书必须可下载。
- **静态简介、职称、单位、研究方向卡片**：同步修改 `index.html` 与 `cn/index.html`。简历预览的职称和单位另外写在 `cv-builder/builder.js`，静态简历 PDF 也需重做。

本机支撑材料与发布仓库位于同一父目录。`../weikai-li-academic-website/assemble_content.py` 是**未纳入本仓库**的材料整理脚本：它读取父目录中的原始证明和 `李伟凯简历中文.docx`，生成其目录下的 `data.js`、PDF 材料和清单。若该脚本可用，先改脚本再运行，并把需要发布的输出同步回本仓库；直接编辑本仓库的 `data.js` 后再运行旧脚本，会覆盖手工编辑。脚本目录中的 HTML/CSS 是旧版，不要复制来覆盖本仓库页面。其他机器可能没有这些原始材料或脚本，此时可直接维护本仓库，但须同步处理关联文件。

## 下载材料

- 公开的证明和论文全文都制成 **A4 PDF（可横向或纵向），单个文件小于 5 MB**。Excel 待补清单单独保留为 `.xlsx`。原件是图片、扫描件或其他格式时，先转换并检查方向、清晰度和页数。
- 检查材料是否包含私人地址、个人电话、证件号、学生学号等不适合公开的内容；必要时只在公开副本中遮盖，保留本地原件。不要把整份原始资料目录上传。
- 项目任务书、证书、论文全文的链接要指向实际存在的 PDF。不要把网页上的下载按钮指向未提交的本地路径。
- 如更新 `data.js` 中的论文或简历信息，同时检查 `assets/cv-zh.pdf`、`assets/cv-en.pdf`、`assets/missing-papers.xlsx`、`assets/missing-papers.pdf`、`missing-papers.md` 是否需要重做。静态简历 PDF 与网页简历生成器是两套输出。

## 预览、核查与发布

1. 在仓库根目录启动本地静态服务器，例如 `python3 -m http.server 8766`。核查 `/` 为英文、`/cn/` 为中文、`/en/` 正确跳转。
2. 检查新内容在两个首页均可读；每个论文方向默认 5 篇且能展开；学生获奖最近 5 年按年排序，每年默认 3 项且能展开。
3. 打开 `/cv-builder/?lang=en` 和 `/cv-builder/?lang=zh`，检查勾选后预览更新、每个章节从 1 编号、打印样式为 A4。
4. 检查全部新增链接返回文件，PDF 页面尺寸为 A4 且文件小于 5 MB；核对 Excel 待补数与 `publications` 中没有 `file` 的记录数相同。
5. 修改 `styles.css`、`app.js`、`data.js` 或简历生成器脚本后，更新 HTML 中相应 `?v=` 查询参数，避免 GitHub Pages 缓存旧内容。
6. 经本次任务授权发布时，在本仓库提交并推送到 `origin/main`。等待 GitHub Pages 构建完成后，检查线上 `/`、`/cn/` 和新增下载链接。仓库地址为 <https://github.com/Cavin-Lee/Cavin-Lee.github.io>。

保持事实准确和证据可追溯。用户提供的新资料、明确更正及最新 Scholar 记录优先于本文中的快照和旧文案。
