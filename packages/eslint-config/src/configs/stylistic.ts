/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { StylisticConfig, TypedFlatConfigItem } from '../types'

import { interopDefault } from '../shared'

export async function createStylisticConfig(options: boolean | StylisticConfig = {}): Promise<TypedFlatConfigItem[]> {
  if (options === false) return []

  const {
    indent = 2,
    quotes = 'single',
    semi = false,
    jsx = true,
    overrides = {}
  } = typeof options === 'object' ? options : {}

  const stylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  // customize() generates a config with @stylistic/* prefixed rules.
  // defaultPluginRenaming maps '@stylistic' → 'style' via composer().renamePlugins().
  const customized = stylistic.configs.customize({ indent, quotes, semi, jsx })

  return [
    {
      name: '@xv-shared/eslint-config/stylistic/rules',
      plugins: customized.plugins as TypedFlatConfigItem['plugins'],
      rules: {
        ...customized.rules,

        // Additional rules not covered by customize()
        '@stylistic/object-curly-newline': ['error', { consistent: true, multiline: true }],
        '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        '@stylistic/operator-linebreak': ['error', 'before'],
        '@stylistic/generator-star-spacing': ['error', { after: true, before: false }],
        '@stylistic/yield-star-spacing': ['error', { after: true, before: false }],

        ...overrides
      }
    }
  ]
}
