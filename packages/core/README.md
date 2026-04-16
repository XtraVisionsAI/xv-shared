# @xv-shared/core

Vue 3 runtime utilities, hooks, directives, HTTP client, and components for [XtraVisions](https://github.com/XtraVisionsAI) projects.

[![npm](https://img.shields.io/npm/v/@xv-shared/core)](https://www.npmjs.com/package/@xv-shared/core) [![license](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

## Install

```bash
pnpm add @xv-shared/core
```

**Peer dependencies:** `vue >= 3.4` (required), `vue-router >= 4` (optional), `naive-ui >= 2.38` (optional, for components)

## Usage

Supports subpath imports for optimal tree-shaking:

```ts
// Utils — type guards, DOM helpers, localStorage with TTL, URL helpers, etc.
import { isFunction, deepMerge, humanFileSize } from '@xv-shared/core/utils'

// Hooks — reactive clock, scroll control
import { useTime, useScroll } from '@xv-shared/core/hooks'

// Directives — clickOutside, copy, debounce, throttle, longpress, draggable
import { clickOutside, copy, debounce } from '@xv-shared/core/directives'

// HTTP Client — XHR-based with interceptors, retry, progress, auth flow
import { createInstance, HttpError } from '@xv-shared/core/request'

// Router — route change event emitter
import { onRouteChange, setRouteEmitter } from '@xv-shared/core/router'

// Components (requires naive-ui)
import { BasicForm, useForm } from '@xv-shared/core/components/form'
import { BasicModal, useModal } from '@xv-shared/core/components/modal'
import { BaseTable, TableAction } from '@xv-shared/core/components/table'
```

Or import everything from the root:

```ts
import { isFunction, useTime, createInstance, BasicForm } from '@xv-shared/core'
```

## Modules

| Subpath | Description |
| --- | --- |
| `@xv-shared/core/utils` | Type guards (`is.ts`), DOM helpers, misc utilities, URL helpers, localStorage with TTL |
| `@xv-shared/core/hooks` | `useTime` (reactive clock), `useScroll` (scroll control with scrollToBottomIfAtBottom) |
| `@xv-shared/core/directives` | `clickOutside`, `copy` (Clipboard API), `debounce`, `throttle`, `longpress`, `draggable` |
| `@xv-shared/core/request` | XHR-based HTTP client with interceptors, retry, progress, auth flow, error deduplication |
| `@xv-shared/core/router` | Route change event emitter (`setRouteEmitter` / `onRouteChange` / `offRouteChange`) |
| `@xv-shared/core/components/*` | NaiveUI-based: BasicForm, BasicModal, BasicTable, AppProvider, SvgIcon, SliderCaptcha, Loading, SpineText |

## Icon Setup (UnoCSS)

`SvgIcon` uses UnoCSS `preset-icons` for compile-time icon inlining (no CDN). Configure your project's `unocss.config.ts`:

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
        /node_modules\/@xv-shared\/core\/dist\/.*\.mjs/ // scan core dist for icon classes
      ]
    }
  }
})
```

## License

[MIT](../../LICENSE) &copy; XtraVisions
