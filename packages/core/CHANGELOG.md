# @xv-shared/core

## 0.2.0

### Minor Changes

- 034538a: fix(core): subpath exports and Naive UI component resolution
  - Switch vite lib build from single entry to multi-entry so each subpath (utils, hooks, directives, request, router, components/\*) generates its own index.mjs aggregation file, fixing "Cannot resolve" errors for all subpath imports.
  - Add explicit Naive UI component imports in all .vue files that use `<n-*>` tags, so the compiler generates direct references instead of runtime `resolveComponent()` calls. This fixes "Failed to resolve component: n-xxx" warnings in consuming projects.

## 0.1.1

### Patch Changes

- d3b031c: docs: add README for each package
