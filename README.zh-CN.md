# xv-shared

[English](./README.md)

[XtraVisions](https://github.com/XtraVisionsAI) 项目的前端工具链共享配置集合。

[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![@xv-shared/eslint-config](https://img.shields.io/npm/v/@xv-shared/eslint-config?label=%40xv-shared%2Feslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config)
[![@xv-shared/vite](https://img.shields.io/npm/v/@xv-shared/vite?label=%40xv-shared%2Fvite)](https://www.npmjs.com/package/@xv-shared/vite)
[![@xv-shared/stylelint-config](https://img.shields.io/npm/v/@xv-shared/stylelint-config?label=%40xv-shared%2Fstylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config)
[![@xv-shared/ts-config](https://img.shields.io/npm/v/@xv-shared/ts-config?label=%40xv-shared%2Fts-config)](https://www.npmjs.com/package/@xv-shared/ts-config)

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
  plugins: createVitePlugins({ /* 选项 */ }),
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
