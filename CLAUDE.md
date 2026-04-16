# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A pnpm monorepo of shared frontend infrastructure for XtraVisions Vue 3 projects, published to npm under the `@xv-shared` scope. Includes build tooling configurations and runtime core library.

**Packages:**

| Package | Build Tool | Purpose |
| --- | --- | --- |
| `@xv-shared/core` | vite (lib mode) | Vue 3 runtime utilities, hooks, directives, HTTP client, components |
| `@xv-shared/eslint-config` | tsup | ESLint flat config with Vue 3 + TypeScript + Prettier |
| `@xv-shared/vite` | tsup | Vite plugin preset for Vue 3 apps |
| `@xv-shared/stylelint-config` | — | Stylelint config (static JSON) |
| `@xv-shared/ts-config` | — | TypeScript configs: base, dev, node (static JSON) |

## Commands

```bash
pnpm install                # Install all dependencies
pnpm build                  # Build all packages
pnpm lint                   # ESLint check
pnpm lint:fix               # ESLint auto-fix
pnpm lint:style             # Stylelint check (CSS/SCSS/Vue)
pnpm lint:style:fix         # Stylelint auto-fix
pnpm format                 # Prettier write
pnpm format:check           # Prettier check

# Per-package build
pnpm --filter @xv-shared/core build
pnpm --filter @xv-shared/eslint-config build
pnpm --filter @xv-shared/vite build
```

**Lint/format ordering matters:** Run `pnpm lint:fix` before `pnpm format` — ESLint's JSON key/array sorting rules can conflict with Prettier output.

## Architecture

### core (`packages/core/`)

Built with vite library mode (`preserveModules: true`) for tree-shaking and subpath imports. Dependencies: `@vueuse/core`, `lodash-es` (runtime); `vue`, `vue-router`, `naive-ui`, `vuedraggable` (peer, all optional except vue).

Icons: SvgIcon uses UnoCSS `preset-icons` for compile-time inlining (no CDN). `src="ri:xxx"` is auto-converted to UnoCSS class `i-ri:xxx`. Consuming projects must configure `@unocss/preset-icons` and scan core's dist in `content.pipeline.include`.

**Subpath imports:**

```ts
import { isFunction, deepMerge } from '@xv-shared/core/utils'
import { useTime } from '@xv-shared/core/hooks'
import { clickOutside } from '@xv-shared/core/directives'
import { createInstance, HttpError } from '@xv-shared/core/request'
import { onRouteChange } from '@xv-shared/core/router'
import { BasicForm, useForm } from '@xv-shared/core/components/form'
import { BasicModal, useModal } from '@xv-shared/core/components/modal'
import { BaseTable, TableAction } from '@xv-shared/core/components/table'
```

**Module structure:**

- `src/utils/` — Type guards (`is.ts`), DOM helpers (`dom.ts`), misc utilities (`misc.ts`), URL helpers (`urls.ts`), localStorage with TTL (`storage.ts`)
- `src/hooks/` — `useTime` (reactive clock), `useScroll` (scroll control with scrollToBottomIfAtBottom)
- `src/directives/` — clickOutside, copy (Clipboard API), debounce, throttle, longpress, draggable
- `src/request/` — XHR-based HTTP client with interceptors, retry, progress, auth flow, error deduplication. Key classes: `HttpClient`, `HttpError`, factory `createInstance()`
- `src/router/` — Route change event emitter (setRouteEmitter/onRouteChange/offRouteChange)
- `src/components/` — NaiveUI-based: BasicForm (schema-driven), BasicModal (draggable), BasicTable (editable cells, pagination, column settings), AppProvider, SvgIcon, SliderCaptcha, Loading, PrimitiveSlot, SpineText

### eslint-config (`packages/eslint-config/`)

- Entry: `src/index.ts` exports async `defineConfig()` returning a `FlatConfigComposer`
- Each concern lives in `src/configs/` (vue.ts, typescript.ts, formatter.ts, etc.) as a `createXxxConfig` function returning `Promise<TypedFlatConfigItem[]>`
- `src/options.ts` resolves user options with auto-detection (TypeScript/Vue presence)
- `src/shared.ts` holds plugin rename map (e.g. `@typescript-eslint` → `ts`, `@stylistic` → `style`)
- `src/globs.ts` defines file glob patterns used across configs
- Typegen: `pnpm --filter @xv-shared/eslint-config typegen` regenerates `typesgen.d.ts` from installed plugins

### vite (`packages/vite/`)

- `src/vite/plugins/index.ts` exports synchronous `createVitePlugins(options, mode)` → `PluginOption[]`
- Each plugin in `src/vite/plugins/` (autoImport.ts, autoComponents.ts, css.ts, etc.) follows `PluginSwitch` pattern: `false` disables, `true` enables defaults, object configures
- `src/vite/env.ts` exports `useEnv()` for typed `.env` variable loading
- `src/vite/proxy.ts` exports `createProxy()` for dev server proxy config
- Key coupling: when `autoRouter: false`, `autoLayout` is also disabled and `vue-router` is removed from auto-imports

### stylelint-config / ts-config

Static config files with no build step. Distributed as-is via npm.

## Versioning and Release

- Uses [Changesets](https://github.com/changesets/changesets) for versioning
- All packages are independently versioned (not linked)
- `pnpm release` publishes via `changeset publish`
- CI runs on push/PR to `main`: build → lint → format check
- Release workflow triggers on push to `main` and uses `changesets/action@v1`

## Key Conventions

- All source files carry a copyright header: `/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */`
- ESM throughout (`"type": "module"` in all packages)
- TypeScript strict mode, target ESNext, bundler module resolution
- Plugin options use deep merge via `lodash-es` (defu-style merging)
- No test framework in this repo — testing happens in consuming projects
