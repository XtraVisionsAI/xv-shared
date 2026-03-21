/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

import { interopDefault } from '../shared'

interface OptionsE18e extends OptionsOverrides {
  modernization?: boolean
}

export async function createE18eConfig(options: OptionsE18e = {}): Promise<TypedFlatConfigItem[]> {
  const { modernization = true, overrides = {} } = options
  const pluginE18e = await interopDefault(import('@e18e/eslint-plugin'))
  const configs = pluginE18e.configs as Record<string, any>

  return [
    {
      name: '@xv-shared/eslint-config/e18e/rules',
      plugins: { e18e: pluginE18e },
      rules: {
        ...(modernization ? { ...configs.modernization?.rules } : {}),
        'e18e/prefer-array-to-reversed': 'off',
        'e18e/prefer-array-to-sorted': 'off',
        'e18e/prefer-array-to-spliced': 'off',
        'e18e/prefer-spread-syntax': 'off',
        ...overrides
      }
    }
  ]
}
