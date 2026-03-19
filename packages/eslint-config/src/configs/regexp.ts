/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import { interopDefault } from '../shared'

import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

interface OptionsRegexp extends OptionsOverrides {
  level?: 'error' | 'warn'
}

export async function createRegexpConfig(
  options: OptionsRegexp = {}
): Promise<TypedFlatConfigItem[]> {
  const { level = 'error', overrides = {} } = options
  const pluginRegexp = await interopDefault(import('eslint-plugin-regexp'))

  const rules = Object.fromEntries(
    Object.entries(pluginRegexp.configs['flat/recommended'].rules ?? {}).map(
      ([key, value]) => [key, value === 'error' && level === 'warn' ? 'warn' : value]
    )
  )

  return [
    {
      name: '@xv-shared/eslint-config/regexp/rules',
      plugins: { regexp: pluginRegexp },
      rules: { ...rules, ...overrides }
    }
  ]
}
