/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { Options as AutoLayoutOptions } from 'vite-plugin-vue-meta-layouts'

import { merge } from 'lodash-es'

const defaultOpt = {
  skipTopLevelRouteLayout: true,
  excludes: ['**/components/**/*.vue']
}

async function configAutoLayoutPlugin(opt?: AutoLayoutOptions) {
  const { default: MetaLayouts } = await import('vite-plugin-vue-meta-layouts')
  return MetaLayouts(merge(defaultOpt, opt))
}

export { type AutoLayoutOptions, configAutoLayoutPlugin }
