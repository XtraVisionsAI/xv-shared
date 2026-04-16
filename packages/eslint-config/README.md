# @xv-shared/eslint-config

Opinionated ESLint flat config for [XtraVisions](https://github.com/XtraVisionsAI) Vue 3 + TypeScript projects.

[![npm](https://img.shields.io/npm/v/@xv-shared/eslint-config)](https://www.npmjs.com/package/@xv-shared/eslint-config) [![license](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

## Features

- ESLint flat config (v10+)
- Vue 3, TypeScript, UnoCSS, JSON/JSONC, Markdown, JSDoc, RegExp rules
- Auto-detects TypeScript and Vue presence
- Built-in Prettier integration via `eslint-plugin-prettier` (can be disabled)
- Import sorting via `eslint-plugin-perfectionist`
- `FlatConfigComposer` for easy extension

## Install

```bash
pnpm add -D @xv-shared/eslint-config
```

## Usage

```js
// eslint.config.js
import defineConfig from '@xv-shared/eslint-config'

export default defineConfig()
```

All options are optional. Pass an object to customize:

```js
export default defineConfig({
  typescript: true, // enable TypeScript rules (auto-detected)
  vue: true, // enable Vue rules (auto-detected)
  unocss: { attributify: true, strict: false },
  prettier: {
    rules: { printWidth: 120, semi: false, singleQuote: true }
  },
  regexp: false, // enable regexp rules
  e18e: false // enable e18e perf rules
})
```

### Without built-in Prettier

If your project manages Prettier separately, disable the built-in integration:

```js
export default defineConfig({
  prettier: false
})
```

When `prettier: false`, the `@stylistic/eslint-plugin` rules remain active and `eslint --fix` acts as the formatter for JS/TS/Vue files.

### Known: `eslint --fix` and `prettier --write` ordering

The config enforces JSON key ordering via `jsonc/sort-keys` and `jsonc/sort-array-values`. To keep both tools in sync, always run them in this order:

```bash
pnpm lint:fix   # apply ESLint fixes (including JSON key/array sorting)
pnpm format     # re-apply Prettier to normalise formatting
```

To disable the conflicting rules:

```js
export default defineConfig(
  {
    /* your options */
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

## License

[MIT](../../LICENSE) &copy; XtraVisions
