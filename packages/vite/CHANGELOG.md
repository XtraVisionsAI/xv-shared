# @xv-shared/vite

## 2.1.1

### Patch Changes

- d3b031c: docs: add README for each package

## 2.1.0

### Minor Changes

- cf3cec9: `createVitePlugins` is now synchronous and returns `PluginOption[]`.

  Vite's `PluginOption` type accepts `Promise<Plugin>`, so async plugins (autoRouter, autoLayout) are resolved by Vite internally without requiring `await` at the call site.

  **Migration:** Remove `async/await` from `vite.config.ts`:

  ```ts
  // before
  export default defineConfig(async ({ mode }) => ({
    plugins: await createVitePlugins({ ... })
  }))

  // after
  export default defineConfig(({ mode }) => ({
    plugins: createVitePlugins({ ... })
  }))
  ```

## 2.0.1

### Patch Changes

- 18febb2: Remove vite-plugin-top-level-await — vite 8 and modern browsers support TLA natively.

## 2.0.0

### Major Changes

- 8f52d2f: Refactor plugin system with opt-in/out controls and upgrade to Vite 8.

  **Breaking changes:**
  - `createVitePlugins` is now **async** — update call sites to `await createVitePlugins(...)`
  - All plugins now accept `false | true | Options` (PluginSwitch). Omit to use defaults, pass `false` to disable
  - `visualizer` is now **opt-in** (default `false`) — pass `visualizer: true` to re-enable
  - `autoRouter: false` now automatically disables `autoLayout` and removes `vue-router` from `autoImport` imports
  - `unplugin-vue-router` replaced by `vue-router/vite` (merged upstream) — requires `vue-router ^5.0.0` as a peer dependency in consuming projects
  - `vue-router` moved from `dependencies` to optional `peerDependencies`
  - Requires Vite `^8.0.3` (previously `^6.x`)
  - `@vitejs/plugin-vue` 5 → 6, `@vitejs/plugin-vue-jsx` 4 → 5
  - `unplugin-auto-import` 19 → 21, `unplugin-icons` 22 → 23, `unplugin-vue-components` 28 → 32
  - `unocss` promoted from beta to stable `66.6.7`
