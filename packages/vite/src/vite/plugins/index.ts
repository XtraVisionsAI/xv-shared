/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import topLevelAwait from 'vite-plugin-top-level-await'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import { type AutoComponentsOptions, configAutoComponentsPlugin } from './autoComponents'
import { type AutoImportOptions, configAutoImportPlugin } from './autoImport'
import { type AutoLayoutOptions, configAutoLayoutPlugin } from './autoLayout'
import { type AutoRouterOptions, configAutoRouterPlugin } from './autoRouter'
import { type CssOptions, configUnoCSSPlugin } from './css'
import { type HtmlOptions, configHtmlPlugin } from './html'
import { type IconOptions, configIconPlugin } from './icons'

import type { Plugin } from 'vite'

export interface PluginOptions {
  autoComponents?: AutoComponentsOptions
  autoImport?: AutoImportOptions
  autoLayout?: AutoLayoutOptions
  autoRouter?: AutoRouterOptions
  css?: CssOptions
  html?: HtmlOptions
  icon?: IconOptions
}

export function createVitePlugins(opt: PluginOptions, mode?: string): Plugin[] {
  const vitePlugins: Plugin[] = [vue(), vueJsx(), vueSetupExtend()]

  vitePlugins.push(
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`
    })
  )

  vitePlugins.push(configAutoImportPlugin(opt.autoImport) as unknown as Plugin)
  vitePlugins.push(configAutoComponentsPlugin(opt.autoComponents) as unknown as Plugin)
  vitePlugins.push(configAutoRouterPlugin(opt.autoRouter))
  vitePlugins.push(configAutoLayoutPlugin(opt.autoLayout) as unknown as Plugin)
  vitePlugins.push(...configHtmlPlugin(opt.html))
  vitePlugins.push(...configUnoCSSPlugin(opt.css))
  vitePlugins.push(configIconPlugin(opt.icon))
  vitePlugins.push(visualizer())

  return vitePlugins
}
