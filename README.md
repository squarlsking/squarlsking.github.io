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

### 在 Conda 环境 `Post` 里用 Node（不要用 `pip install npm`）

`pip install npm` 安装的是 PyPI 上的 **Python 包**，不是 Node 自带的包管理器，无法用来跑 Astro。

在已激活的 `Post` 环境中安装 Node（与 `.nvmrc` 对齐）：

```sh
conda activate Post
conda install -c conda-forge "nodejs=22.12.*" -y
```

然后在本仓库根目录执行 `npm install`、`npm run dev`、`npm run build`。若使用 `conda run -n Post npm run build` 时 conda 因控制台编码报错，可先 `conda activate Post`，再直接运行 `npm run build`；或在 PowerShell 中先执行 `chcp 65001` 再构建。

临时把当前终端接到 `Post` 里的 Node（不激活整个环境时）：

```powershell
$env:PATH = "D:\CondaENV\envs\Post;D:\CondaENV\envs\Post\Scripts;" + $env:PATH
```
（若你的 Conda 安装路径不同，把 `D:\CondaENV\envs\Post` 换成 `conda env list` 里 `Post` 对应的路径。）

## 重要提醒

- 不要编辑 `dist/` 目录下的文件，`dist/` 是构建产物。
- 只编辑 `src/` 下的源文件。

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

1. 归档页 `/posts` 的完整列表（首页仅保留进入归档的链接）
2. 笔记详情页：`/notes/{slug}/`
3. 静态 JSON 接口：`/notes.json`

统一数据逻辑在：

- `src/lib/notes.ts`

详情页路由在：

- `src/pages/notes/[slug].astro`

归档页在：

- `src/pages/posts.astro`

静态 JSON 接口在：

- `src/pages/notes.json.ts`

旧路径 `/math-notes`、`/paper-thoughts`、`/life-travel` 会重定向到 `/posts`。

## 发布流程

1. 写或更新笔记（`src/content/notes`）
2. 本地验证：`npm run build`
3. push 到 `main`
4. GitHub Actions 自动部署到 GitHub Pages
