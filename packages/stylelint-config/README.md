# @xv-shared/stylelint-config

Opinionated Stylelint config for [XtraVisions](https://github.com/XtraVisionsAI) Vue 3 projects.

[![npm](https://img.shields.io/npm/v/@xv-shared/stylelint-config)](https://www.npmjs.com/package/@xv-shared/stylelint-config) [![license](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

## Features

- CSS, SCSS, and Vue SFC `<style>` block support
- Property sort order via SMACSS methodology
- Prettier integration via `stylelint-prettier`
- `@stylistic/stylelint-config` for consistent formatting
- Supports UnoCSS at-rules (`@apply`, `@screen`, etc.)

## Install

```bash
pnpm add -D @xv-shared/stylelint-config
```

**Peer dependency:** `stylelint >= 17`

## Usage

```json
// .stylelintrc.json
{
  "extends": "@xv-shared/stylelint-config"
}
```

Stylelint does not scan files by default — you must pass a glob. Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint:style": "stylelint \"src/**/*.{css,scss,vue}\"",
    "lint:style:fix": "stylelint \"src/**/*.{css,scss,vue}\" --fix"
  }
}
```

## What's included

| Extends / Plugin                              | Purpose                    |
| --------------------------------------------- | -------------------------- |
| `stylelint-config-recommended`                | Baseline recommended rules |
| `stylelint-config-recommended-scss`           | SCSS-specific rules        |
| `stylelint-config-recommended-vue`            | Vue SFC `<style>` support  |
| `stylelint-config-property-sort-order-smacss` | SMACSS property ordering   |
| `@stylistic/stylelint-config`                 | Stylistic formatting rules |
| `stylelint-scss`                              | SCSS linting               |
| `stylelint-order`                             | Declaration ordering       |
| `stylelint-prettier`                          | Prettier integration       |

## License

[MIT](../../LICENSE) &copy; XtraVisions
