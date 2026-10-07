# 李伟凯学术主页 / Wei-Kai Li Academic Website

英文主页：<https://cavin-lee.github.io/> · 中文主页：<https://cavin-lee.github.io/cn/>

网站展示学术经历、研究方向、论文、科研项目、学术服务、个人荣誉及指导学生获奖。下载区的资料均为 A4 PDF，单个文件小于 5 MB。

论文目录以 [Google Scholar 个人主页](https://scholar.google.com/citations?user=XEfV8mkAAAAJ&hl=zh-CN) 在 2026 年 10 月 3 日可见的 80 条记录为准，按研究方向分类。每个方向默认展示最新五篇，其余可展开。其中 33 篇在本地材料中找到可确认匹配的全文；其余 47 篇见 [Excel 待补清单](assets/missing-papers.xlsx)、[PDF 清单](assets/missing-papers.pdf) 或 [Markdown 清单](missing-papers.md)。Google Scholar 上的记录、年份和发表状态可能继续变化。

网页生成和下载的简历中，论文使用 GB/T 7714—2025 顺序编码格式。原始 Google Scholar 引文和简历专用格式分别存储在 `data.js` 的 `citation`、`gbtCitation` 字段；本地管理页面可单独修订后者。

[定制简历](https://cavin-lee.github.io/cv-builder/)可勾选教育经历、项目、论文、学术服务和获奖内容，并切换中英文；论文在简历中按年份列出，不按方向分组，各章节从 1 开始编号。简历预览和 A4 打印版包含照片。点击“生成 A4 PDF”后，在浏览器打印窗口选择“保存为 PDF”。也可直接下载带照片的[中文简历](assets/cv-zh.pdf)或[英文简历](assets/cv-en.pdf)。科研项目中的批准通知和任务书也可从项目卡片下载。

网站是静态页面，可由 GitHub Pages 直接托管。论文及其他资料的展示数据位于 `data.js`，学术记录的采集快照位于 `scholar-publications.json`。

后续维护请先阅读 [网站维护指南](AGENTS.md) 和 [Agent 接手说明](WEBSITE_HANDOFF.md)。后者集中记录材料位置、当前状态、修改对应文件、验证及发布方法，并附有可直接交给下一个 Agent 的任务模板。具体条目查 [内容索引](CONTENT_INDEX.md)，近期改动查 [修改记录](CONTENT_CHANGELOG.md)。

## 在本机自主编辑与发布

在 Mac 上双击仓库中的 [start-manager.command](start-manager.command)，首次启动会安装少量本地组件。浏览器会自动打开 `http://127.0.0.1:8787/manage/`；终端窗口保持打开，管理页面才可使用。此页面只在本机运行。

管理页面可以编辑中英文主页文案、新闻、论文、项目、教育经历、学术服务和获奖条目。在对应条目的编辑表单中上传 A4、5 MB 以下的 PDF，路径会自动填入当前条目；保存条目后才能把新 PDF 发布。保存会更新网站文件、`CONTENT_INDEX.md` 和 `CONTENT_CHANGELOG.md`。论文变动会重做缺失全文清单，相关内容变动会重做静态简历 PDF。先点击页面顶部的预览链接检查，再到“提交到 GitHub”勾选文件并发布。首次发布需要本机 Git 已连接到 Cavin-Lee 账号；如 Git 要求登录，请完成系统弹出的 GitHub 登录。

管理页面不能自行核验论文与 Google Scholar 是否一致，也不会自动裁剪或压缩上传的 PDF。新论文请先核对 Scholar 记录链接；扫描材料请先制成 A4、5 MB 以下的公开副本。关闭终端即可停止本地管理页面。
