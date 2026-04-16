/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import defineConfig from '@xv-shared/eslint-config'

export default defineConfig(
  {
    vue: true,
    typescript: {
      tsconfigPath: './tsconfig.json'
    },
    unocss: false,
    markdown: false,
    ignores: ['**/node_modules/**', '**/dist/**', '**/typesgen.d.ts']
  },
  {
    // eslint-config source interacts with untyped third-party plugin APIs
    files: [
      'packages/eslint-config/src/**/*.ts',
      'packages/vite/src/**/*.ts',
      'packages/core/src/**/*.ts',
      'packages/core/src/**/*.vue'
    ],
    rules: {
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-floating-promises': 'off'
    }
  }
)
