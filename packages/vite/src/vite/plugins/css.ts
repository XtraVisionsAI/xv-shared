import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { merge } from 'lodash-es'
import UnoCSS from 'unocss/vite'

import type { VitePluginConfig as CssOptions } from 'unocss/vite'

const defaultOpt = {
  transformers: [transformerDirectives(), transformerVariantGroup()]
}

function configUnoCSSPlugin(_env: ViteEnv, _mode: string, opt?: CssOptions) {
  return UnoCSS(merge(defaultOpt, opt))
}

export { configUnoCSSPlugin, type CssOptions }
