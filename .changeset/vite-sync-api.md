---
'@xv-shared/vite': minor
---

`createVitePlugins` is now synchronous and returns `PluginOption[]`.

Vite's `PluginOption` type accepts `Promise<Plugin>`, so async plugins
(autoRouter, autoLayout) are resolved by Vite internally without
requiring `await` at the call site.

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
