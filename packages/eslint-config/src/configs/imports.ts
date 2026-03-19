/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import { interopDefault } from '../shared'

import type { TypedFlatConfigItem } from '../types'

export async function createImportsConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginImport = await interopDefault(import('eslint-plugin-import-x'))
  const pluginUnusedImports = await interopDefault(import('eslint-plugin-unused-imports'))

  return [
    {
      name: `@xv-shared/eslint-config/imports/rules`,
      plugins: {
        import: pluginImport as any,
        'unused-imports': pluginUnusedImports
      },
      rules: {
        'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/newline-after-import': ['error', { count: 1 }],

        'unused-imports/no-unused-imports': 'warn',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            vars: 'all',
            varsIgnorePattern: '^_'
          }
        ]
      }
    }
  ]
}
