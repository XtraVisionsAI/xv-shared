/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import { interopDefault } from '../shared'

import type { TypedFlatConfigItem } from '../types'

export async function createPerfectionistConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'))

  return [
    {
      name: '@shared/eslint-config/perfectionist/rules',
      plugins: {
        perfectionist: pluginPerfectionist
      }
    }
  ]
}
