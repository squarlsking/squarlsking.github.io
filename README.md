# V1 Homepage (Astro)

个人主页与博客系统，基于 Astro + Tailwind + React + Content Collections。

## 常用命令

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Node 版本要求

- 使用 Node `22.12.0`（LTS）
- Astro 官方不支持奇数版本 Node（例如 `23`），可能出现 Vite 运行时异常（如 `EnvironmentPluginContainer.transform`）

建议在项目根目录执行：

```sh
nvm use
```

## 重要提醒

- 不要编辑 `dist/` 目录下的文件，`dist/` 是构建产物。
- 只编辑 `src/` 下的源文件。

## 每周更新 Now Working On

每周只改一个文件：

- `src/data/now-working.ts`

你需要改两处：

1. `weekLabel`：例如 `2026-W13`
2. `items`：本周任务和 `done` 状态

主页会自动读取并显示，不用再手改页面结构。

## 笔记写作位置（支持 LaTeX）

把笔记写在：

- `src/content/notes/*.mdx`

建议使用 `.mdx`。项目已配置数学公式渲染：

- 行内公式：`$...$`
- 块公式：

```md
$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$
```

可复制模板：

- `templates/math-note-template.mdx`

## 笔记自动化流程（已打通）

你只要新增/修改 `src/content/notes` 的 MDX 文件，以下内容会自动更新：

1. 首页笔记卡片（可点击）
2. 数学笔记页面
3. 论文思考页面
4. 笔记详情页：`/notes/{slug}/`
5. 静态 JSON 接口：`/notes.json`

统一数据逻辑在：

- `src/lib/notes.ts`

详情页路由在：

- `src/pages/notes/[slug].astro`

静态 JSON 接口在：

- `src/pages/notes.json.ts`

## 发布流程

1. 写或更新笔记（`src/content/notes`）
2. 本地验证：`npm run build`
3. push 到 `main`
4. GitHub Actions 自动部署到 GitHub Pages
