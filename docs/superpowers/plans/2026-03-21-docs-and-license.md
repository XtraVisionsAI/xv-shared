# Docs & License Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 xv-shared monorepo 补全开源文档：更新所有子包的 package.json（license/author/description），创建根目录 LICENSE 文件，以及中英双语 README。

**Architecture:** 直接修改现有文件 + 新建文件，无需构建步骤。所有变更都在仓库根目录和 packages/\* 目录内完成。README 采用 GitHub 流行工具库风格（参考 antfu/eslint-config + UnoCSS），简洁专业，无过多 emoji，徽章克制。

**Tech Stack:** Markdown, JSON (package.json)

---

## File Map

**修改：**

- `package.json` — 根包，确认无需改动（`private: true` 正确）
- `packages/eslint-config/package.json` — license + description
- `packages/vite/package.json` — license + description
- `packages/stylelint-config/package.json` — license + description
- `packages/ts-config/package.json` — license + description

**新建：**

- `LICENSE` — MIT 许可证
- `README.md` — 英文版主 README
- `README.zh-CN.md` — 中文版 README

---

### Task 1: 更新所有子包 package.json

**Files:**

- Modify: `packages/eslint-config/package.json`
- Modify: `packages/vite/package.json`
- Modify: `packages/stylelint-config/package.json`
- Modify: `packages/ts-config/package.json`

- [ ] **Step 1: 更新 `packages/eslint-config/package.json`**

将 `"license": "EULA"` 改为 `"license": "MIT"`，description 改为：

```json
"description": "Opinionated ESLint flat config for XtraVisions Vue 3 projects",
"license": "MIT",
```

- [ ] **Step 2: 更新 `packages/vite/package.json`**

将 `"license": "EULA"` 改为 `"license": "MIT"`，description 改为：

```json
"description": "Shared Vite configuration and plugins for XtraVisions frontend projects",
"license": "MIT",
```

- [ ] **Step 3: 更新 `packages/stylelint-config/package.json`**

补充缺失的 `license` 字段、更新 `description`（`author` 字段已存在，无需新增）：

```json
"description": "Opinionated Stylelint config for XtraVisions Vue 3 projects",
"license": "MIT",
```

- [ ] **Step 4: 更新 `packages/ts-config/package.json`**

补充缺失的 `license` 字段、更新 `description`（`author` 字段已存在，无需新增）：

```json
"description": "Shared TypeScript configuration for XtraVisions projects",
"license": "MIT",
```

- [ ] **Step 5: 验证所有 package.json 格式正确**

运行：

```bash
node -e "require('./packages/eslint-config/package.json'); require('./packages/vite/package.json'); require('./packages/stylelint-config/package.json'); require('./packages/ts-config/package.json'); console.log('All valid')"
```

预期输出：`All valid`

- [ ] **Step 6: Commit**

```bash
git add packages/eslint-config/package.json packages/vite/package.json packages/stylelint-config/package.json packages/ts-config/package.json
git commit -m "chore: update license to MIT and improve descriptions in all packages"
```

---

### Task 2: 创建 LICENSE 文件

**Files:**

- Create: `LICENSE`

- [ ] **Step 1: 在根目录创建 MIT LICENSE 文件**

文件内容如下（年份 2026，版权归属 XtraVisions）：

```
MIT License

Copyright (c) 2026 XtraVisions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "chore: add MIT LICENSE file"
```

---

### Task 3: 创建英文 README.md

**Files:**

- Create: `README.md`

README 风格参考 antfu/eslint-config + UnoCSS：简洁专业，无过多 emoji，顶部有 shields.io 徽章行，特性用 bullet points，安装用渐进式展示，各包一节。

- [ ] **Step 1: 创建 `README.md`**

````markdown
# xv-shared

[中文文档](./README.zh-CN.md)

Shared frontend tooling configurations for [XtraVisions](https://github.com/XtraVisionsAI) projects.

[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE) [![@xv-shared/eslint-config](https://img.shields.io/npm/v/@xv-shared/eslint-config?label=%40xv-shared%2Feslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) [![@xv-shared/vite](https://img.shields.io/npm/v/@xv-shared/vite?label=%40xv-shared%2Fvite)](https://www.npmjs.com/package/@xv-shared/vite) [![@xv-shared/stylelint-config](https://img.shields.io/npm/v/@xv-shared/stylelint-config?label=%40xv-shared%2Fstylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) [![@xv-shared/ts-config](https://img.shields.io/npm/v/@xv-shared/ts-config?label=%40xv-shared%2Fts-config)](https://www.npmjs.com/package/@xv-shared/ts-config)

## Packages

| Package | Version | Description |
| --- | --- | --- |
| [`@xv-shared/eslint-config`](./packages/eslint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/eslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) | Opinionated ESLint flat config for Vue 3 projects |
| [`@xv-shared/vite`](./packages/vite) | [![npm](https://img.shields.io/npm/v/@xv-shared/vite)](https://www.npmjs.com/package/@xv-shared/vite) | Shared Vite configuration and plugins |
| [`@xv-shared/stylelint-config`](./packages/stylelint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/stylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) | Opinionated Stylelint config for Vue 3 projects |
| [`@xv-shared/ts-config`](./packages/ts-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/ts-config)](https://www.npmjs.com/package/@xv-shared/ts-config) | Shared TypeScript configuration |

## Usage

### ESLint Config

```bash
pnpm add -D @xv-shared/eslint-config
```
````

```js
// eslint.config.js
import xv from '@xv-shared/eslint-config'

export default xv()
```

### Vite Config

```bash
pnpm add -D @xv-shared/vite
```

```ts
// vite.config.ts
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig({
  plugins: createVitePlugins({
    /* options */
  })
})
```

### Stylelint Config

```bash
pnpm add -D @xv-shared/stylelint-config
```

```json
// .stylelintrc.json
{
  "extends": "@xv-shared/stylelint-config"
}
```

### TypeScript Config

```bash
pnpm add -D @xv-shared/ts-config
```

```json
// tsconfig.json
{
  "extends": "@xv-shared/ts-config/base"
}
```

## Requirements

- Node.js >= 18
- pnpm >= 10

## License

[MIT](./LICENSE) &copy; XtraVisions

````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add English README"
````

---

### Task 4: 创建中文 README.zh-CN.md

**Files:**

- Create: `README.zh-CN.md`

内容与英文版结构镜像，完整中文翻译，顶部链接指向英文版。

- [ ] **Step 1: 创建 `README.zh-CN.md`**

````markdown
# xv-shared

[English](./README.md)

[XtraVisions](https://github.com/XtraVisionsAI) 项目的前端工具链共享配置集合。

[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE) [![@xv-shared/eslint-config](https://img.shields.io/npm/v/@xv-shared/eslint-config?label=%40xv-shared%2Feslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) [![@xv-shared/vite](https://img.shields.io/npm/v/@xv-shared/vite?label=%40xv-shared%2Fvite)](https://www.npmjs.com/package/@xv-shared/vite) [![@xv-shared/stylelint-config](https://img.shields.io/npm/v/@xv-shared/stylelint-config?label=%40xv-shared%2Fstylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) [![@xv-shared/ts-config](https://img.shields.io/npm/v/@xv-shared/ts-config?label=%40xv-shared%2Fts-config)](https://www.npmjs.com/package/@xv-shared/ts-config)

## 包列表

| 包名 | 版本 | 说明 |
| --- | --- | --- |
| [`@xv-shared/eslint-config`](./packages/eslint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/eslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) | 面向 Vue 3 项目的 ESLint flat 配置 |
| [`@xv-shared/vite`](./packages/vite) | [![npm](https://img.shields.io/npm/v/@xv-shared/vite)](https://www.npmjs.com/package/@xv-shared/vite) | 共享 Vite 配置与插件集 |
| [`@xv-shared/stylelint-config`](./packages/stylelint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/stylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) | 面向 Vue 3 项目的 Stylelint 配置 |
| [`@xv-shared/ts-config`](./packages/ts-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/ts-config)](https://www.npmjs.com/package/@xv-shared/ts-config) | 共享 TypeScript 配置 |

## 使用方式

### ESLint 配置

```bash
pnpm add -D @xv-shared/eslint-config
```
````

```js
// eslint.config.js
import xv from '@xv-shared/eslint-config'

export default xv()
```

### Vite 配置

```bash
pnpm add -D @xv-shared/vite
```

```ts
// vite.config.ts
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig({
  plugins: createVitePlugins({
    /* 选项 */
  })
})
```

### Stylelint 配置

```bash
pnpm add -D @xv-shared/stylelint-config
```

```json
// .stylelintrc.json
{
  "extends": "@xv-shared/stylelint-config"
}
```

### TypeScript 配置

```bash
pnpm add -D @xv-shared/ts-config
```

```json
// tsconfig.json
{
  "extends": "@xv-shared/ts-config/base"
}
```

## 环境要求

- Node.js >= 18
- pnpm >= 10

## 许可证

[MIT](./LICENSE) &copy; XtraVisions

````

- [ ] **Step 2: Commit**

```bash
git add README.zh-CN.md
git commit -m "docs: add Chinese README"
````
