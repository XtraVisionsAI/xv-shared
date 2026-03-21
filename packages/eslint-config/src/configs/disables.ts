/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { TypedFlatConfigItem } from '../types'

import { GLOB_SRC, GLOB_SRC_EXT } from '../globs'

export async function createDisablesConfig(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: '@xv-shared/eslint-config/disables/scripts',
      files: [`**/scripts/${GLOB_SRC}`, `**/scripts/*.${GLOB_SRC_EXT}`],
      rules: {
        'no-console': 'off',
        'ts/explicit-function-return-type': 'off',
        'unicorn/no-top-level-await': 'off'
      }
    },
    {
      name: '@xv-shared/eslint-config/disables/dts',
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off'
      }
    },
    {
      name: '@xv-shared/eslint-config/disables/cjs',
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        'ts/no-require-imports': 'off'
      }
    },
    {
      name: '@xv-shared/eslint-config/disables/config-files',
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      rules: {
        'no-console': 'off',
        'ts/explicit-function-return-type': 'off',
        'unicorn/no-top-level-await': 'off'
      }
    }
  ]
}
