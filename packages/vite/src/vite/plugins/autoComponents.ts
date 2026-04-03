import type { ComponentResolver, Options } from 'unplugin-vue-components/types'
import { merge } from 'lodash-es'
import IconsResolver from 'unplugin-icons/resolver'
import { NaiveUiResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// 新增可配置项接口（覆盖 Options 中需要定制的字段）
interface AutoComponentsOptions extends Omit<Options, 'dirs' | 'dts' | 'resolvers'> {
  dirs?: string[]
  dts?: string
  resolvers?: ComponentResolver[]
}

function configAutoComponentsPlugin(opt?: AutoComponentsOptions) {
  const defaultOpt: Options = {
    dirs: opt?.dirs ?? ['src/**/components'],
    resolvers: [NaiveUiResolver(), VueUseComponentsResolver(), IconsResolver(), ...(opt?.resolvers ?? [])],
    extensions: ['vue', 'tsx'],
    dts: opt?.dts ?? 'types/generated/auto-components.d.ts',
    deep: true,
    directoryAsNamespace: false
  }

  const { dirs: _d, dts: _dt, resolvers: _r, ...restOpt } = opt ?? {}
  return Components(merge(defaultOpt, restOpt))
}

export { type AutoComponentsOptions, configAutoComponentsPlugin }
