/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import type { OptionsVue, StylisticConfig, TypedFlatConfigItem } from '../types'
import { GLOB_VUE } from '../globs'

import { interopDefault } from '../shared'

import { createTsRules } from './typescript'

export async function createVueConfig(
  options: boolean | OptionsVue = {},
  tsOverrides: TypedFlatConfigItem['rules'] = {},
  stylisticConfig?: StylisticConfig
): Promise<TypedFlatConfigItem[]> {
  if (options === false) return []

  const { files = [GLOB_VUE], overrides = {}, a11y = false, sfcBlocks = false } = options as OptionsVue

  const [pluginVue, parserVue, parserTs] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('@typescript-eslint/parser'))
  ])

  const tsRules = await createTsRules()

  let processor: any = pluginVue.processors!['.vue']

  if (sfcBlocks) {
    const { mergeProcessors } = await interopDefault(import('eslint-merge-processors'))
    const processorVueBlocks = await interopDefault(import('eslint-processor-vue-blocks'))
    processor = mergeProcessors([pluginVue.processors!['.vue'], processorVueBlocks()])
  }

  const configs: TypedFlatConfigItem[] = [
    {
      name: '@xv-shared/eslint-config/vue/core',
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly'
        }
      },
      plugins: {
        vue: pluginVue
      }
    },
    {
      name: '@xv-shared/eslint-config/vue/rules',
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          parser: parserTs,
          extraFileExtensions: ['.vue'],
          sourceType: 'module'
        }
      },
      processor,
      rules: {
        ...tsRules,
        ...tsOverrides,
        ...pluginVue.configs.base.rules,
        ...pluginVue.configs.essential.rules,
        ...pluginVue.configs['strongly-recommended'].rules,
        ...pluginVue.configs.recommended.rules,

        'node/prefer-global/process': 'off',

        'vue/attribute-hyphenation': 'off',
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style']
          }
        ],

        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'kebab-case'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
            defineExposeLast: true
          }
        ],
        'vue/define-props-declaration': ['warn', 'type-based'],

        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],

        'vue/eqeqeq': ['error', 'smart'],

        'vue/html-indent': ['error', stylisticConfig?.indent ?? 2],
        'vue/html-quotes': ['error', 'double'],
        'vue/html-closing-bracket-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/multi-word-component-names': 'off',

        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-for-template-key-on-child': 'off',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        // Vue template-specific stylistic rules (not covered by @stylistic/eslint-plugin)
        'vue/block-tag-newline': [
          'error',
          {
            multiline: 'always',
            singleline: 'always'
          }
        ],
        'vue/html-comment-content-spacing': [
          'error',
          'always',
          {
            exceptions: ['-']
          }
        ],
        'vue/padding-line-between-blocks': ['error', 'always'],

        // JS expression stylistic rules inside Vue templates are handled by @stylistic/eslint-plugin
        // The following rules are intentionally removed:
        // vue/array-bracket-spacing, vue/arrow-spacing, vue/block-spacing, vue/brace-style,
        // vue/comma-dangle, vue/comma-spacing, vue/comma-style, vue/key-spacing,
        // vue/keyword-spacing, vue/object-curly-newline, vue/object-curly-spacing,
        // vue/object-property-newline, vue/operator-linebreak, vue/quote-props,
        // vue/space-in-parens, vue/template-curly-spacing

        ...overrides
      }
    }
  ]

  if (a11y) {
    const pluginVueA11y = await interopDefault(import('eslint-plugin-vuejs-accessibility'))
    configs.push({
      name: '@xv-shared/eslint-config/vue/a11y/rules',
      files,
      plugins: {
        'vue-a11y': pluginVueA11y
      },
      rules: {
        ...(pluginVueA11y.configs?.['flat/recommended'] as any)?.rules
      }
    })
  }

  return configs
}
