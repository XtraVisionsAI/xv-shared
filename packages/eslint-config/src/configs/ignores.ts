/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { TypedFlatConfigItem } from '../types'
import { GLOB_EXCLUDES } from '../globs'
import { interopDefault } from '../shared'

export async function createIgnoresConfig(
  ignores: string[] = [],
  flatignores: string[] = []
): Promise<TypedFlatConfigItem[]> {
  const excludes = [...GLOB_EXCLUDES]

  const ignore = await interopDefault(import('eslint-config-flat-gitignore'))

  if (flatignores.length > 0) {
    const config = ignore({ files: flatignores, strict: false })
    excludes.push(...config.ignores)
  }

  return [
    {
      name: '@xv-shared/eslint-config/ignores/rules',
      ignores: [...excludes, ...ignores]
    }
  ]
}
