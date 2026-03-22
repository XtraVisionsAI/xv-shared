/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import type { PrettierRules, StylisticConfig, UserOptions } from './types'

const DEFAULT_PRETTIER_RULES: PrettierRules = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  vueIndentScriptAndStyle: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  trailingComma: 'none',
  jsxSingleQuote: true,
  arrowParens: 'always',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',
  rangeStart: 0
}

const DEFAULT_PRETTIER_FORMATTERS = {
  html: true,
  json: true,
  markdown: true
}

export const DEFAULT_STYLISTIC_CONFIG: StylisticConfig = {
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true
}

async function loadPrettierConfig(cwd: string) {
  let prettierConfig: PrettierRules = {}

  try {
    const prettierrc = await readFile(path.join(cwd, '.prettierrc'), 'utf-8')

    prettierConfig = JSON.parse(prettierrc)
  } catch {}

  return prettierConfig
}

export async function createOptions(options: UserOptions = {}): Promise<UserOptions> {
  const opts: Required<UserOptions> = {
    cwd: process.cwd(),
    ignores: [],
    prettier: {
      rules: DEFAULT_PRETTIER_RULES,
      formatters: DEFAULT_PRETTIER_FORMATTERS
    },
    flatignore: ['.gitignore', '.eslintignore'],
    javascript: {},
    typescript: {},
    vue: {},
    unocss: { attributify: true, strict: false },
    markdown: {},
    jsonc: {},
    regexp: false,
    e18e: false,
    stylistic: { ...DEFAULT_STYLISTIC_CONFIG }
  }

  const {
    cwd,
    ignores,
    flatignore,
    prettier,
    javascript,
    typescript,
    unocss,
    vue,
    markdown = true,
    jsonc = true,
    regexp = false,
    e18e = false,
    stylistic
  } = options

  //cwd
  if (cwd) {
    opts.cwd = cwd
  }

  //ignores
  if (ignores?.length) {
    opts.ignores = [...opts.ignores, ...ignores]
  }

  //flatignores
  if (typeof flatignore === 'object') {
    opts.flatignore = [...new Set([...opts.flatignore, ...flatignore])]
  }

  //prettier
  if (typeof prettier === 'object') {
    opts.prettier = {
      rules: { ...DEFAULT_PRETTIER_RULES, ...prettier.rules },
      formatters: { ...DEFAULT_PRETTIER_FORMATTERS, ...prettier.formatters }
    }
  } else if (prettier === false) {
    opts.prettier = prettier
  }

  if (typeof opts.prettier === 'object') {
    const prettierConfig = await loadPrettierConfig(opts.cwd)
    Object.assign(opts.prettier.rules!, prettierConfig)

    // Sync .prettierrc values back to stylistic so ESLint checks stay consistent with Prettier output
    if (typeof opts.stylistic === 'object') {
      const rc = prettierConfig as PrettierRules
      if (rc.tabWidth !== undefined) opts.stylistic.indent = rc.useTabs ? 'tab' : rc.tabWidth
      if (rc.semi !== undefined) opts.stylistic.semi = rc.semi
      if (rc.singleQuote !== undefined) opts.stylistic.quotes = rc.singleQuote ? 'single' : 'double'
    }
  }

  //stylistic
  if (stylistic === false) {
    opts.stylistic = false
  } else if (typeof stylistic === 'object') {
    opts.stylistic = { ...DEFAULT_STYLISTIC_CONFIG, ...stylistic }
  }
  // stylistic === true or undefined: keep DEFAULT_STYLISTIC_CONFIG
  // When prettier: false, stylistic remains enabled (provides formatting via eslint --fix)

  //javascript
  if (typeof javascript === 'object') {
    opts.javascript = javascript
  }

  //typescript
  if (typeof typescript === 'object') {
    Object.assign(opts.typescript, typescript)
  } else if (typescript === false) {
    opts.typescript = typescript
  }

  //unocss
  if (typeof unocss === 'object') {
    Object.assign(opts.unocss, unocss)
  } else if (unocss === false) {
    opts.unocss = unocss
  }

  //vue
  if (typeof vue === 'object') {
    Object.assign(opts.vue, vue)
  } else if (vue === false) {
    opts.vue = vue
  }

  //markdown
  if (typeof markdown === 'object') {
    Object.assign(opts.markdown, markdown)
  } else if (markdown === false) {
    opts.markdown = markdown
  }

  //jsonc
  if (typeof jsonc === 'object') {
    Object.assign(opts.jsonc, jsonc)
  } else if (jsonc === false) {
    opts.jsonc = jsonc
  }

  //regexp
  if (typeof regexp === 'object') {
    opts.regexp = Object.assign({}, regexp)
  } else if (regexp === true) {
    opts.regexp = {}
  }

  //e18e
  if (typeof e18e === 'object') {
    opts.e18e = Object.assign({}, e18e)
  } else if (e18e === true) {
    opts.e18e = {}
  }

  return opts
}
