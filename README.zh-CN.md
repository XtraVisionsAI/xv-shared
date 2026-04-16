# xv-shared

[English](./README.md) | **中文文档**

[XtraVisions](https://github.com/XtraVisionsAI) 项目的前端共享基础设施。

[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE) [![@xv-shared/core](https://img.shields.io/npm/v/@xv-shared/core?label=%40xv-shared%2Fcore)](https://www.npmjs.com/package/@xv-shared/core) [![@xv-shared/eslint-config](https://img.shields.io/npm/v/@xv-shared/eslint-config?label=%40xv-shared%2Feslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) [![@xv-shared/vite](https://img.shields.io/npm/v/@xv-shared/vite?label=%40xv-shared%2Fvite)](https://www.npmjs.com/package/@xv-shared/vite) [![@xv-shared/stylelint-config](https://img.shields.io/npm/v/@xv-shared/stylelint-config?label=%40xv-shared%2Fstylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) [![@xv-shared/ts-config](https://img.shields.io/npm/v/@xv-shared/ts-config?label=%40xv-shared%2Fts-config)](https://www.npmjs.com/package/@xv-shared/ts-config)

## 包列表

| 包名 | 版本 | 说明 |
| --- | --- | --- |
| [`@xv-shared/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@xv-shared/core)](https://www.npmjs.com/package/@xv-shared/core) | Vue 3 运行时工具、hooks、指令、HTTP 客户端、组件 |
| [`@xv-shared/eslint-config`](./packages/eslint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/eslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) | 面向 Vue 3 项目的 ESLint flat 配置 |
| [`@xv-shared/vite`](./packages/vite) | [![npm](https://img.shields.io/npm/v/@xv-shared/vite)](https://www.npmjs.com/package/@xv-shared/vite) | 共享 Vite 配置与插件集 |
| [`@xv-shared/stylelint-config`](./packages/stylelint-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/stylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) | 面向 Vue 3 项目的 Stylelint 配置 |
| [`@xv-shared/ts-config`](./packages/ts-config) | [![npm](https://img.shields.io/npm/v/@xv-shared/ts-config)](https://www.npmjs.com/package/@xv-shared/ts-config) | 共享 TypeScript 配置 |

## 使用方式

### Core

```bash
pnpm add @xv-shared/core
```

支持子路径导入以优化 tree-shaking：

```ts
// 工具函数
import { isFunction, deepMerge, humanFileSize } from '@xv-shared/core/utils'

// Hooks
import { useTime, useScroll } from '@xv-shared/core/hooks'

// 指令
import { clickOutside, copy, debounce } from '@xv-shared/core/directives'

// HTTP 客户端
import { createInstance, HttpError } from '@xv-shared/core/request'

// 路由
import { onRouteChange, setRouteEmitter } from '@xv-shared/core/router'

// 组件（需要 naive-ui）
import { BasicForm, useForm } from '@xv-shared/core/components/form'
import { BasicModal, useModal } from '@xv-shared/core/components/modal'
import { BaseTable, TableAction } from '@xv-shared/core/components/table'
```

也可以从根路径统一导入：

```ts
import { isFunction, useTime, createInstance, BasicForm } from '@xv-shared/core'
```

#### 图标配置 (UnoCSS)

`@xv-shared/core` 组件中的图标使用 UnoCSS `preset-icons` 编译时内联（无需 CDN）。消费项目需在 `unocss.config.ts` 中配置：

```ts
import presetIcons from '@unocss/preset-icons'
import presetWind4 from '@unocss/preset-wind4'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetIcons()],
  content: {
    pipeline: {
      include: [
        /\.(vue|ts|tsx)($|\?)/,
        /node_modules\/@xv-shared\/core\/dist\/.*\.mjs/ // 扫描 core 产物中的图标 class
      ]
    }
  }
})
```

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
  typescript: true, // 启用 TypeScript 规则（可自动检测）
  vue: true, // 启用 Vue 规则（可自动检测）
  unocss: { attributify: true, strict: false },
  prettier: {
    rules: { printWidth: 120, semi: false, singleQuote: true }
  },
  regexp: false, // 启用 regexp 规则
  e18e: false // 启用 e18e 性能规则
})
```

#### 不使用内置 Prettier

如果项目中单独管理 Prettier，可禁用内置集成：

```js
export default defineConfig({
  prettier: false
})
```

`prettier: false` 时，`@stylistic/eslint-plugin` 规则仍然生效，`eslint --fix` 将作为 JS/TS/Vue 文件的格式化工具。

#### 已知问题：`eslint --fix` 与 `prettier --write` 的执行顺序

`@xv-shared/eslint-config` 通过 `jsonc/sort-keys` 和 `jsonc/sort-array-values` 强制 JSON 字段和数组排序。这些规则的 auto-fix 可能产生与 Prettier 输出不一致的格式（例如将短数组展开为多行）。为保持两者同步，请始终按以下顺序执行：

```bash
pnpm lint:fix   # 执行 ESLint 修复（包含 JSON 字段/数组排序）
pnpm format     # 重新执行 Prettier 统一格式化
```

如果需要禁用冲突规则，可在配置中追加覆盖：

```js
export default defineConfig(
  {
    /* 你的选项 */
  },
  {
    files: ['**/*.json'],
    rules: {
      'jsonc/sort-keys': 'off',
      'jsonc/sort-array-values': 'off'
    }
  }
)
```

### Vite 配置

```bash
pnpm add -D @xv-shared/vite
```

`createVitePlugins` 是同步函数，直接在 `defineConfig` 中使用：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { createVitePlugins } from '@xv-shared/vite'

export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins(
    {
      // 所有选项均接受 false | true | Options 三态
      // 省略 = 使用默认值启用
      // false = 禁用
      // true = 使用默认配置启用
      // 对象 = 自定义配置启用

      autoImport: {
        // unplugin-auto-import：默认自动导入 vue/pinia/@vueuse/core
        // 启用 autoRouter 时自动添加 vue-router
        dts: 'types/generated/auto-import.d.ts'
      },
      autoComponents: {
        // unplugin-vue-components：默认扫描 src/**/components
        // 内置 NaiveUI、VueUse、Icons resolver
        dts: 'types/generated/auto-components.d.ts'
      },
      autoRouter: {
        // vue-router 文件路由（需要消费应用安装 vue-router ^5.0.0）
        // 设为 false 时：同时禁用 autoLayout，并从 autoImport 中移除 vue-router
        dts: 'types/generated/typed-router.d.ts'
      },
      autoLayout: {
        // vite-plugin-vue-meta-layouts（autoRouter: false 时自动禁用）
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
      },
      visualizer: true // 按需开启：默认关闭，开启后构建时生成 stats.html
    },
    mode
  )
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

#### 不使用文件路由

对于手动管理路由的项目：

```ts
export default defineConfig(({ mode }) => ({
  plugins: createVitePlugins({
    autoRouter: false // 同时禁用 autoRouter 和 autoLayout
    // 并从 autoImport 中移除 vue-router
  })
}))
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

- Node.js >= 20
- pnpm >= 10
- ESLint >= 10
- Stylelint >= 17

## 许可证

[MIT](./LICENSE) &copy; XtraVisions
