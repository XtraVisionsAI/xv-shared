# xv-shared

[English](./README.md) | **中文文档**

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

```js
// eslint.config.js
import defineConfig from '@xv-shared/eslint-config'

export default defineConfig()
```

所有选项均为可选，按需传入：

```js
export default defineConfig({
  typescript: true,         // 启用 TypeScript 规则（可自动检测）
  vue: true,                // 启用 Vue 规则（可自动检测）
  unocss: { attributify: true, strict: false },
  prettier: {
    rules: { printWidth: 120, semi: false, singleQuote: true }
  },
  regexp: false,            // 启用 regexp 规则
  e18e: false               // 启用 e18e 性能规则
})
```

### Vite 配置

```bash
pnpm add -D @xv-shared/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins({
    // 所有选项均为可选，省略则使用默认值
    autoImport: {
      // unplugin-auto-import：默认自动导入 vue/vue-router/pinia/@vueuse/core
      dts: 'types/generated/auto-import.d.ts'
    },
    autoComponents: {
      // unplugin-vue-components：默认扫描 src/**/components
      // 内置 NaiveUI、VueUse、Icons resolver
      dts: 'types/generated/auto-components.d.ts'
    },
    autoRouter: {
      // unplugin-vue-router：基于文件的路由
      dts: 'types/generated/typed-router.d.ts'
    },
    autoLayout: {
      // vite-plugin-vue-meta-layouts
      skipTopLevelRouteLayout: true
    },
    html: {
      // vite-plugin-html
      entry: '/src/main.ts',
      template: 'index.html',
      minify: true
    },
    icon: {
      // unplugin-icons：默认从 src/assets/svg-icons 加载 SVG 作为 local 图标集
      iconDir: 'src/assets/svg-icons'
    },
    css: {
      // unocss/vite：始终包含 transformerDirectives 和 transformerVariantGroup
      // 如需传入额外的 UnoCSS vite 插件选项可在此配置
    }
  }, mode)
}))
```

UnoCSS 的 presets 和主题在单独文件中配置：

```ts
// unocss.config.ts
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    // 自定义主题 token
  }
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
