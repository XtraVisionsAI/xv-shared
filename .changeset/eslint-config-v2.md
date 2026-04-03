---
'@xv-shared/eslint-config': major
---

Upgrade to ESLint 10 and modernize plugin ecosystem.

**Breaking changes:**

- Requires ESLint `^10.1.0` (previously `^9.x`)
- Requires `globals ^17.0.0`, `jsonc-eslint-parser ^3.0.0`, `vue-eslint-parser ^10.0.0`
- `eslint-plugin-eslint-comments` replaced by `@eslint-community/eslint-plugin-eslint-comments ^4.7.1`
- `eslint-plugin-markdown` replaced by `@eslint/markdown ^8.0.1`
- `eslint-plugin-perfectionist` upgraded to v5 — `sort-imports` groups use new `value-*`/`type-*` prefix syntax (old names like `internal-type`, `parent-type`, `object` are removed)
- `eslint-plugin-unicorn` 57 → 64, `eslint-plugin-jsonc` 2 → 3, `eslint-plugin-regexp` 2 → 3, `eslint-plugin-jsdoc` 50 → 62, `eslint-flat-config-utils` 2 → 3, `eslint-merge-processors` 0.1 → 2, `eslint-processor-vue-blocks` 0.1 → 2
- `@stylistic/eslint-plugin` 3 → 5, `@typescript-eslint/*` 8.26 → 8.58
- `eslint-plugin-vue` updated to support ESLint 10
