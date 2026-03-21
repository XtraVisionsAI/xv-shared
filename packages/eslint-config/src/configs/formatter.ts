/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { OptionsPrettier, PrettierParser, PrettierRules, TypedFlatConfigItem } from '../types'
import { GLOB_HTML, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_MARKDOWN } from '../globs'

import { interopDefault } from '../shared'

const parserPlain = {
  meta: {
    name: 'eslint-parser-plain'
  },
  parseForESLint: (code: string) => ({
    ast: {
      type: 'Program',
      loc: { start: 0, end: code.length },
      range: [0, code.length],
      body: [],
      comments: [],
      tokens: []
    },
    services: { isPlain: true },
    scopeManager: null,
    visitorKeys: {
      Program: []
    }
  })
}

export async function createFormatterConfig(options: boolean | OptionsPrettier = {}): Promise<TypedFlatConfigItem[]> {
  if (options === false) return []

  const opts = options as OptionsPrettier

  const { html = true, json = true, markdown = true } = opts.formatters || {}
  const prettierRules = opts.rules || {}

  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'))
  const recommendedPrettier = await interopDefault(import('eslint-plugin-prettier/recommended'))

  function createPrettierFormatter(files: string[], parser: PrettierParser, plugins?: string[]) {
    const rules: PrettierRules = {
      ...prettierRules,
      ...(parser === 'markdown' ? { embeddedLanguageFormatting: 'off' } : {}),
      parser
    }

    if (plugins?.length) {
      rules.plugins = [...(rules.plugins || []), ...plugins]
    }

    const config: TypedFlatConfigItem = {
      name: `@xv-shared/eslint-config/formatter-${parser}/rules`,
      files,
      languageOptions: {
        parser: parserPlain
      },
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        'prettier/prettier': ['warn', rules as any]
      }
    }

    return config
  }

  const configs: TypedFlatConfigItem[] = [
    {
      name: '@xv-shared/eslint-config/prettier/core',
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        'prettier/prettier': ['warn', prettierRules as any],
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
      }
    }
  ]

  if (html) {
    const htmlConfig = createPrettierFormatter([GLOB_HTML], 'html')
    configs.push(htmlConfig)
  }

  if (json) {
    const jsonConfig = createPrettierFormatter([GLOB_JSON, GLOB_JSONC], 'json')
    const json5Config = createPrettierFormatter([GLOB_JSON5], 'json5')
    configs.push(jsonConfig, json5Config)
  }

  if (markdown) {
    const markdownConfig = createPrettierFormatter([GLOB_MARKDOWN], 'markdown')
    configs.push(markdownConfig)
  }

  configs.push(recommendedPrettier)

  return configs
}
