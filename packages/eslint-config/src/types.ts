/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { ConfigNames, RuleOptions } from './typesgen'

interface PrettierRulessRequired {
  /**
   * Specify the line length that the printer will wrap on.
   * @default 120
   */
  printWidth: number
  /**
   * Specify the number of spaces per indentation-level.
   */
  tabWidth: number
  /**
   * Indent lines with tabs instead of spaces
   */
  useTabs?: boolean
  /**
   * Print semicolons at the ends of statements.
   */
  semi: boolean
  /**
   * Use single quotes instead of double quotes.
   */
  singleQuote: boolean
  /**
   * Use single quotes in JSX.
   */
  jsxSingleQuote: boolean
  /**
   * Print trailing commas wherever possible.
   */
  trailingComma: 'none' | 'es5' | 'all'
  /**
   * Print spaces between brackets in object literals.
   */
  bracketSpacing: boolean
  /**
   * Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
   * alone on the next line (does not apply to self closing elements).
   */
  bracketSameLine: boolean
  /**
   * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
   * @deprecated use bracketSameLine instead
   */
  jsxBracketSameLine: boolean
  /**
   * Format only a segment of a file.
   */
  rangeStart: number
  /**
   * Format only a segment of a file.
   * @default Number.POSITIVE_INFINITY
   */
  rangeEnd: number
  /**
   * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
   * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
   * @default "preserve"
   */
  proseWrap: 'always' | 'never' | 'preserve'
  /**
   * Include parentheses around a sole arrow function parameter.
   * @default "always"
   */
  arrowParens: 'avoid' | 'always'
  /**
   * Provide ability to support new languages to prettier.
   */
  plugins: Array<string | any>
  /**
   * How to handle whitespaces in HTML.
   * @default "css"
   */
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore'
  /**
   * Which end of line characters to apply.
   * @default "lf"
   */
  endOfLine: 'auto' | 'lf' | 'crlf' | 'cr'
  /**
   * Change when properties in objects are quoted.
   * @default "as-needed"
   */
  quoteProps: 'as-needed' | 'consistent' | 'preserve'
  /**
   * Whether or not to indent the code inside <script> and <style> tags in Vue files.
   * @default false
   */
  vueIndentScriptAndStyle: boolean
  /**
   * Enforce single attribute per line in HTML, Vue and JSX.
   * @default false
   */
  singleAttributePerLine: boolean
}

export type PrettierParser =
  | 'acorn'
  | 'angular'
  | 'babel-flow'
  | 'babel-ts'
  | 'babel'
  | 'css'
  | 'espree'
  | 'flow'
  | 'glimmer'
  | 'graphql'
  | 'html'
  | 'json-stringify'
  | 'json'
  | 'json5'
  | 'less'
  | 'lwc'
  | 'markdown'
  | 'mdx'
  | 'meriyah'
  | 'scss'
  | 'typescript'
  | 'vue'
  | 'yaml'

export type Awaitable<T> = T | Promise<T>

// eslint-disable-next-line no-use-before-define
export type LiteralUnion<T extends U, U = string> = T | (Pick<U, never> & { _?: never | undefined })

export type LinterProcessor = Linter.Processor

export type Rules = RuleOptions

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins' | 'languageOptions'> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>
  // Relax languageOptions type to avoid incompatibility between @types/eslint and @eslint/core
  languageOptions?: Record<string, any>
}

export interface PrettierRules extends Partial<PrettierRulessRequired> {
  parser?: LiteralUnion<PrettierParser>
}

export interface OptionsPrettier {
  /**
   * Default prettier rules
   *
   * @default
   * ```json
   * {
   *   "printWidth": 120,
   *   "tabWidth": 2,
   *   "useTabs": false,
   *   "semi": false,
   *   "vueIndentScriptAndStyle": true,
   *   "singleQuote": true,
   *   "quoteProps": "as-needed",
   *   "bracketSpacing": true,
   *   "trailingComma": "none",
   *   "jsxSingleQuote": true,
   *   "arrowParens": "always",
   *   "proseWrap": "never",
   *   "htmlWhitespaceSensitivity": "strict",
   *   "endOfLine": "lf",
   *   "rangeStart": 0
   * }
   * ```
   */
  rules?: PrettierRules
  /**
   * @default
   * {
   *  "html": true,
   *  "json": true,
   *  "markdown": true
   * }
   */
  formatters?: {
    html?: boolean
    json?: boolean
    markdown?: boolean
  }
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue', 'ts']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsOverrides {
  files?: string[]
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsMarkdown extends OptionsOverrides, OptionsComponentExts {}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Enable a11y accessibility rules for Vue.
   * Requires installing: eslint-plugin-vue-a11y
   * @default false
   */
  a11y?: boolean

  /**
   * Enable SFC blocks processing.
   * Allows linting <script> and <style> blocks independently.
   * Requires: eslint-processor-vue-blocks
   * @default false
   */
  sfcBlocks?: boolean
}

export interface OptionsTypeScript extends OptionsOverrides, OptionsComponentExts {
  tsconfigPath?: string | string[]
  parserOptions?: Partial<ParserOptions>
  filesTypeAware?: string[]
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}

export interface UserOptions {
  /**
   * The current working directory
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * The globs to ignore lint
   *
   * @default []
   */
  ignores?: string[]
  /**
   * Enable flat git/eslint ignore support.
   *
   * Path to `.gitignore` files
   * By defult, will use `'.gitignore'` and '.eslintignore' automation.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   *
   * @default ['.gitignore', '.eslintignore']
   */
  flatignore?: string[]
  /**
   * Whether to use prettier to format files
   * If true, will use default prettier options
   * You can use `.prettierrc` to override the default prettier rules
   *
   * @see OptionsPrettier
   * @default true
   */
  prettier?: boolean | OptionsPrettier
  /**
   * Javascript override rules.
   */
  javascript?: OptionsOverrides
  /**
   * Enable TypeScript support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypeScript
  /**
   * Enable unocss rules.
   *
   * @default false
   */
  unocss?: boolean | OptionsUnoCSS
  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue
  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * To format Markdown content, need enable `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsMarkdown
  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides
  /**
   * Enable regexp rules.
   *
   * @default false
   */
  regexp?: boolean | { level?: 'error' | 'warn'; overrides?: TypedFlatConfigItem['rules'] }
  /**
   * Enable e18e modernization rules.
   *
   * @default false
   */
  e18e?: boolean | { modernization?: boolean; overrides?: TypedFlatConfigItem['rules'] }
}

export type { ConfigNames, FlatConfigComposer }
