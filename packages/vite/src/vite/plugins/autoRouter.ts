/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { Plugin } from 'vite'
import type { Options } from 'vue-router/unplugin'

import { merge } from 'lodash-es'

interface AutoRouterOptions extends Omit<Options, 'dts'> {
  dts?: string
}

async function configAutoRouterPlugin(opt?: AutoRouterOptions): Promise<Plugin> {
  const { default: VueRouter } = await import('vue-router/vite')

  const defaultOpt = {
    dts: opt?.dts ?? 'types/generated/typed-router.d.ts'
  }

  const { dts: _d, ...restOpt } = opt ?? {}
  return VueRouter(merge(defaultOpt, restOpt)) as Plugin
}

export { type AutoRouterOptions, configAutoRouterPlugin }
