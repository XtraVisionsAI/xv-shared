import { merge } from 'lodash-es'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'

import type { Options } from 'unplugin-icons/types'
import type { Plugin } from 'vite'

const defaultOpt = {
  defaultStyle: 'display:inline-block',
  compiler: 'vue3',
  customCollections: {
    local: FileSystemIconLoader('src/assets/svg-icons', (svg) =>
      svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"')
    )
  }
}

interface IconOptions extends Options {
  iconDir?: string
}

function configIconPlugin(_env: ViteEnv, _mode: string, opt?: IconOptions) {
  const { iconDir, ...restOpt } = opt ?? {}

  const customCollections = {
    ...defaultOpt.customCollections,
    ...(iconDir !== undefined
      ? {
          local: FileSystemIconLoader(iconDir, (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"')
          )
        }
      : {})
  }

  return Icons(merge({}, defaultOpt, { customCollections }, restOpt)) as any as Plugin
  // 注：as any as Plugin 是 unplugin-icons 类型与 Vite Plugin 类型的已知不兼容
}

export { configIconPlugin, type IconOptions }
