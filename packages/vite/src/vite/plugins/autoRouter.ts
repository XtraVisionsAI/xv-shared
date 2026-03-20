import { merge } from 'lodash-es'
import VueRouter from 'unplugin-vue-router/vite'

import type { Options } from 'unplugin-vue-router'
import type { Plugin } from 'vite'

interface AutoRouterOptions extends Omit<Options, 'dts'> {
  dts?: string
}

function configAutoRouterPlugin(opt?: AutoRouterOptions) {
  const defaultOpt = {
    dts: opt?.dts ?? 'types/generated/typed-router.d.ts'
  }

  const { dts: _d, ...restOpt } = opt ?? {}
  return VueRouter(merge(defaultOpt, restOpt)) as Plugin
}

export { configAutoRouterPlugin, type AutoRouterOptions }
