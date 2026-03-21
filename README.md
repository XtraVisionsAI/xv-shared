# xv-shared

[中文文档](./README.zh-CN.md)

Shared frontend tooling configurations for [XtraVisions](https://github.com/XtraVisionsAI) projects.

[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![@xv-shared/eslint-config](https://img.shields.io/npm/v/@xv-shared/eslint-config?label=%40xv-shared%2Feslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config)
[![@xv-shared/vite](https://img.shields.io/npm/v/@xv-shared/vite?label=%40xv-shared%2Fvite)](https://www.npmjs.com/package/@xv-shared/vite)
[![@xv-shared/stylelint-config](https://img.shields.io/npm/v/@xv-shared/stylelint-config?label=%40xv-shared%2Fstylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config)
[![@xv-shared/ts-config](https://img.shields.io/npm/v/@xv-shared/ts-config?label=%40xv-shared%2Fts-config)](https://www.npmjs.com/package/@xv-shared/ts-config)

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
  plugins: createVitePlugins({ /* options */ }),
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
