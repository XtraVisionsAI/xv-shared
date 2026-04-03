/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer'
import type { Plugin } from 'vite'
import type { Options as TopLevelAwaitOptions } from 'vite-plugin-top-level-await'
import type { AutoComponentsOptions } from './autoComponents'
import type { AutoImportOptions } from './autoImport'
import type { AutoLayoutOptions } from './autoLayout'
import type { AutoRouterOptions } from './autoRouter'
import type { CssOptions } from './css'
import type { HtmlOptions } from './html'
import type { IconOptions } from './icons'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import topLevelAwait from 'vite-plugin-top-level-await'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import { configAutoComponentsPlugin } from './autoComponents'
import { configAutoImportPlugin } from './autoImport'
import { configAutoLayoutPlugin } from './autoLayout'
import { configAutoRouterPlugin } from './autoRouter'
import { configUnoCSSPlugin } from './css'
import { configHtmlPlugin } from './html'
import { configIconPlugin } from './icons'

type PluginSwitch<T> = false | true | T

export interface PluginOptions {
  // 基础 Vue 插件（默认启用）
  vue?: PluginSwitch<Parameters<typeof vue>[0]>
  vueJsx?: PluginSwitch<Parameters<typeof vueJsx>[0]>
  vueSetupExtend?: boolean
  topLevelAwait?: PluginSwitch<TopLevelAwaitOptions>
  // visualizer 默认关闭，需显式开启
  visualizer?: PluginSwitch<PluginVisualizerOptions>

  // 功能插件（默认启用，传 false 可关闭）
  autoComponents?: PluginSwitch<AutoComponentsOptions>
  autoImport?: PluginSwitch<AutoImportOptions>
  // autoLayout 在 autoRouter: false 时自动跳过
  autoLayout?: PluginSwitch<AutoLayoutOptions>
  autoRouter?: PluginSwitch<AutoRouterOptions>
  css?: PluginSwitch<CssOptions>
  html?: PluginSwitch<HtmlOptions>
  icon?: PluginSwitch<IconOptions>
}

function isEnabled<T>(val: PluginSwitch<T> | undefined, defaultEnabled = true): boolean {
  if (val === undefined) return defaultEnabled
  return val !== false
}

function getOptions<T>(val: PluginSwitch<T> | undefined): T | undefined {
  if (val === undefined || val === true || val === false) return undefined
  return val
}

function buildAutoImportOpt(
  val: PluginSwitch<AutoImportOptions> | undefined,
  routerEnabled: boolean
): AutoImportOptions {
  const base = getOptions(val) ?? {}
  if (routerEnabled) return base
  const imports = base.imports ?? ['vue', 'vue-router', 'pinia', '@vueuse/core']
  const filtered = (Array.isArray(imports) ? imports : [imports]).filter(
    (i) => i !== 'vue-router'
  ) as AutoImportOptions['imports']
  return { ...base, imports: filtered }
}

export async function createVitePlugins(opt: PluginOptions = {}, _mode?: string): Promise<Plugin[]> {
  const vitePlugins: Plugin[] = []
  const routerEnabled = isEnabled(opt.autoRouter)

  if (isEnabled(opt.vue)) vitePlugins.push(vue(getOptions(opt.vue)))
  if (isEnabled(opt.vueJsx)) vitePlugins.push(vueJsx(getOptions(opt.vueJsx)))
  if (opt.vueSetupExtend !== false) vitePlugins.push(vueSetupExtend())

  if (isEnabled(opt.topLevelAwait)) {
    vitePlugins.push(
      topLevelAwait(
        getOptions(opt.topLevelAwait) ?? {
          promiseExportName: '__tla',
          promiseImportName: (i: number) => `__tla_${i}`
        }
      )
    )
  }

  if (isEnabled(opt.autoImport)) {
    vitePlugins.push(configAutoImportPlugin(buildAutoImportOpt(opt.autoImport, routerEnabled)) as unknown as Plugin)
  }

  if (isEnabled(opt.autoComponents)) {
    vitePlugins.push(configAutoComponentsPlugin(getOptions(opt.autoComponents)) as unknown as Plugin)
  }

  if (routerEnabled) {
    vitePlugins.push(await configAutoRouterPlugin(getOptions(opt.autoRouter)))
  }

  if (routerEnabled && isEnabled(opt.autoLayout)) {
    vitePlugins.push((await configAutoLayoutPlugin(getOptions(opt.autoLayout))) as unknown as Plugin)
  }

  if (isEnabled(opt.html)) vitePlugins.push(...configHtmlPlugin(getOptions(opt.html)))
  if (isEnabled(opt.css)) vitePlugins.push(...configUnoCSSPlugin(getOptions(opt.css)))
  if (isEnabled(opt.icon)) vitePlugins.push(configIconPlugin(getOptions(opt.icon)))

  // visualizer 默认关闭
  if (isEnabled(opt.visualizer, false)) {
    vitePlugins.push(visualizer(getOptions(opt.visualizer)) as unknown as Plugin)
  }

  return vitePlugins
}
