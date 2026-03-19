import { merge } from 'lodash-es'
import { createHtmlPlugin } from 'vite-plugin-html'

import type { HtmlTagDescriptor, Plugin } from 'vite'

interface HtmlOptions {
  minify: boolean
  entry: string
  template: string
  inject?: {
    data?: Record<string, any>
    tags: HtmlTagDescriptor[]
  }
}

const defaultOpt: HtmlOptions = {
  minify: true,
  entry: '/src/main.ts',
  template: 'index.html'
}

function configHtmlPlugin(_env: ViteEnv, _mode: string, opt?: HtmlOptions): Plugin[] {
  // as unknown as Plugin[]：PluginOption 与 Plugin[] 的已知类型不兼容，运行时实际返回数组
  return createHtmlPlugin(merge(defaultOpt, opt)) as unknown as Plugin[]
}

export { configHtmlPlugin, type HtmlOptions }
