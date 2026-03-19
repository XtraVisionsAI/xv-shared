import { GLOB_JSX, GLOB_TSX } from '../globs'
import { interopDefault } from '../shared'

import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

export async function createReactConfig(
  options: boolean | OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  if (options === false) return []

  const { files = [GLOB_JSX, GLOB_TSX], overrides = {} } = options as OptionsOverrides

  const [pluginReact, pluginReactHooks] = await Promise.all([
    interopDefault(import('eslint-plugin-react')),
    interopDefault(import('eslint-plugin-react-hooks'))
  ])

  return [
    {
      name: '@xv-shared/eslint-config/react/core',
      plugins: {
        react: pluginReact,
        'react-hooks': pluginReactHooks
      }
    },
    {
      name: '@xv-shared/eslint-config/react/rules',
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      },
      rules: {
        ...pluginReact.configs.recommended.rules,
        ...pluginReactHooks.configs.recommended.rules,
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        ...overrides
      }
    }
  ]
}
