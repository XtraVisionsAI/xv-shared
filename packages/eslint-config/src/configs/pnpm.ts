/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../shared'

export async function createPnpmConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginPnpm = await interopDefault(import('eslint-plugin-pnpm'))

  return [
    {
      name: '@xv-shared/eslint-config/pnpm/rules',
      files: ['**/package.json'],
      plugins: { pnpm: pluginPnpm },
      rules: { ...pluginPnpm.configs.recommended.rules }
    }
  ]
}
