/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type {
  Awaitable,
  ConfigNames,
  FlatConfigComposer,
  OptionsTypeScript,
  TypedFlatConfigItem,
  UserOptions
} from './types'

import { createCommentsConfig } from './configs/comments'
import { createDisablesConfig } from './configs/disables'
import { createE18eConfig } from './configs/e18e'
import { createFormatterConfig } from './configs/formatter'
import { createIgnoresConfig } from './configs/ignores'
import { createImportsConfig } from './configs/imports'
import { createJavascriptConfig } from './configs/javascript'
import { createJsDocConfig } from './configs/jsdoc'
import { createJSONConfig } from './configs/jsonc'
import { createMarkdownConfig } from './configs/markdown'
import { createNodeConfig } from './configs/node'
import { createPerfectionistConfig } from './configs/perfectionist'
import { createPnpmConfig } from './configs/pnpm'
import { createRegexpConfig } from './configs/regexp'
import { createTypescriptConfig } from './configs/typescript'
import { createUnicornConfig } from './configs/unicorn'
import { createUnocssConfig } from './configs/unocss'
import { createVueConfig } from './configs/vue'
import { createOptions } from './options'
import { composer, defaultPluginRenaming } from './shared'

export default async function defineConfig(
  options: Partial<UserOptions> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem>[]
): Promise<FlatConfigComposer<TypedFlatConfigItem, ConfigNames>> {
  const opts = await createOptions(options)

  const tsOverride = opts.typescript ? (opts.typescript as OptionsTypeScript).overrides : {}

  const comments = await createCommentsConfig()
  const formatter = await createFormatterConfig(opts.prettier)
  const ignores = await createIgnoresConfig(opts.ignores, opts.flatignore)
  const imports = await createImportsConfig()
  const javascript = await createJavascriptConfig(opts.javascript)
  const jsdoc = await createJsDocConfig()
  const json = await createJSONConfig(opts.jsonc)
  const node = await createNodeConfig()
  const markdown = await createMarkdownConfig(opts.markdown)
  const perfectionist = await createPerfectionistConfig()
  const typescript = await createTypescriptConfig(opts.typescript)
  const unicorn = await createUnicornConfig()
  const unocss = await createUnocssConfig(opts.unocss)
  const vue = await createVueConfig(opts.vue, tsOverride)
  const regexp = opts.regexp ? await createRegexpConfig(opts.regexp === true ? {} : opts.regexp) : []
  const e18e = opts.e18e ? await createE18eConfig(opts.e18e === true ? {} : opts.e18e) : []
  const pnpm = await createPnpmConfig()
  const disables = await createDisablesConfig()

  const userResolved = await Promise.all(userConfigs)

  const configs = [
    //basic
    ...ignores,
    ...javascript,
    ...comments,
    ...node,
    ...jsdoc,
    ...imports,
    ...unicorn,
    ...perfectionist,
    //optional
    ...typescript,
    ...unocss,
    ...vue,
    ...regexp,
    ...e18e,
    ...json,
    ...markdown,
    //userdefined
    ...userResolved,
    //always-on
    ...pnpm,
    ...disables,
    //formatter
    ...formatter
  ]

  return composer(configs).renamePlugins(defaultPluginRenaming)
}
