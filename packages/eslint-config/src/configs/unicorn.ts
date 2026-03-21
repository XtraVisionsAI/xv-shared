/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../shared'

export async function createUnicornConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginUnicorn = await interopDefault(import('eslint-plugin-unicorn'))

  return [
    {
      name: '@xv-shared/eslint-config/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn
      },
      rules: {
        'unicorn/consistent-empty-array-spread': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-instanceof-builtins': 'error',
        'unicorn/number-literal-case': 'error',
        'unicorn/prefer-dom-node-text-content': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-node-protocol': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/throw-new-error': 'error'
      }
    }
  ]
}
