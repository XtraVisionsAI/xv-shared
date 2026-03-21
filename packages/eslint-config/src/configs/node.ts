/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../shared'

export async function createNodeConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginNode = await interopDefault(import('eslint-plugin-n'))

  return [
    {
      name: `@xv-shared/eslint-config/node/rules`,
      plugins: {
        node: pluginNode
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'never'],
        'node/process-exit-as-throw': 'error'
      }
    }
  ]
}
