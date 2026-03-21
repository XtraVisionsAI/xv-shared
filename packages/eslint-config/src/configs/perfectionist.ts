/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { TypedFlatConfigItem } from '../types'

import { interopDefault } from '../shared'

export async function createPerfectionistConfig(): Promise<TypedFlatConfigItem[]> {
  const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'))

  return [
    {
      name: '@xv-shared/eslint-config/perfectionist/rules',
      plugins: {
        perfectionist: pluginPerfectionist
      },
      rules: {
        'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              'type',
              ['builtin', 'external'],
              'internal-type',
              'internal',
              ['parent-type', 'sibling-type', 'index-type'],
              ['parent', 'sibling', 'index'],
              'object',
              'unknown'
            ],
            newlinesBetween: 'ignore',
            order: 'asc',
            type: 'natural'
          }
        ],
        'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }]
      }
    }
  ]
}
