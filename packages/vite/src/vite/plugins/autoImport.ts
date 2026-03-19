import { merge } from 'lodash-es'
import AutoImport from 'unplugin-auto-import/vite'

import type { Options } from 'unplugin-auto-import/types'

interface AutoImportOptions extends Omit<Options, 'dts'> {
  dts?: string
}

function configAutoImportPlugin(_env: ViteEnv, _mode: string, opt?: AutoImportOptions) {
  const defaultOpt: Options = {
    include: [
      /\.[tj]sx?$/,
      /\.vue$/,
      /\.vue\?vue/,
      /\.md$/
    ],
    imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
    dts: opt?.dts ?? 'types/generated/auto-import.d.ts',
    eslintrc: {
      enabled: true,
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true
    }
  }

  const { dts: _d, ...restOpt } = opt ?? {}
  return AutoImport(merge(defaultOpt, restOpt))
}

export { configAutoImportPlugin, type AutoImportOptions }
