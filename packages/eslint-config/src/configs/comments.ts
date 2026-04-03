/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../shared'

export async function createCommentsConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginComments = await interopDefault(import('@eslint-community/eslint-plugin-eslint-comments'))

  return [
    {
      name: '@xv-shared/eslint-config/comments/rules',
      plugins: {
        'eslint-comments': pluginComments
      },
      rules: {
        'eslint-comments/no-aggregating-enable': 'error',
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-enable': 'error'
      }
    }
  ]
}
