import type { Options as AutoLayoutOptions } from 'vite-plugin-vue-meta-layouts'
import { merge } from 'lodash-es'
import MetaLayouts from 'vite-plugin-vue-meta-layouts'

const defaultOpt = {
  skipTopLevelRouteLayout: true,
  excludes: ['**/components/**/*.vue']
}

function configAutoLayoutPlugin(opt?: AutoLayoutOptions) {
  return MetaLayouts(merge(defaultOpt, opt))
}

export { type AutoLayoutOptions, configAutoLayoutPlugin }
