/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import defineConfig from '@xv-shared/eslint-config'

export default defineConfig({
  vue: true,
  typescript: {
    tsconfigPath: './tsconfig.json'
  },
  unocss: false,
  ignores: ['**/node_modules/**', '**/dist/**']
})
