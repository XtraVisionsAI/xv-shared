import type { VitePluginConfig as CssOptions } from 'unocss/vite'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { merge } from 'lodash-es'
import UnoCSS from 'unocss/vite'

const defaultOpt = {
  transformers: [transformerDirectives(), transformerVariantGroup()]
}

function configUnoCSSPlugin(opt?: CssOptions) {
  return UnoCSS(merge(defaultOpt, opt))
}

export { configUnoCSSPlugin, type CssOptions }
