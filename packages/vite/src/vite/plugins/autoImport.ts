import type { Options } from 'unplugin-auto-import/types'
import { merge } from 'lodash-es'

import AutoImport from 'unplugin-auto-import/vite'

interface AutoImportOptions extends Omit<Options, 'dts'> {
  dts?: string
}

function configAutoImportPlugin(opt?: AutoImportOptions) {
  const defaultOpt: Options = {
    include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
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

export { type AutoImportOptions, configAutoImportPlugin }
