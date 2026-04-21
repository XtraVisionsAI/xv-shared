<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script lang="ts">
  import type { PropType } from 'vue'
  import type { ActionItem } from '../types/tableAction'
  import { NButton, NDropdown } from 'naive-ui'
  import { computed, defineComponent, toRaw } from 'vue'

  import { isBoolean, isFunction } from '../../../utils/is'
  import { SvgIcon } from '../../svg-icon'

  export default defineComponent({
    name: 'TableAction',
    components: { NButton, NDropdown, SvgIcon },
    props: {
      actions: {
        type: Array as PropType<ActionItem[]>,
        default: null
      },
      dropDownActions: {
        type: Array as PropType<ActionItem[]>,
        default: null
      },
      style: {
        type: String as PropType<string>,
        default: 'button'
      },
      select: {
        type: Function as PropType<Function>, // eslint-disable-line ts/no-unsafe-function-type
        default: () => {}
      }
    },
    setup(props) {
      const actionType = props.style === 'button' ? 'default' : props.style === 'text' ? 'primary' : 'default'
      const actionText = props.style === 'button' ? undefined : props.style === 'text' ? true : undefined

      const getMoreProps = computed(() => {
        return {
          text: actionText,
          type: actionType,
          size: 'small'
        }
      })

      const getDropdownList = computed(() => {
        return (toRaw(props.dropDownActions) || []).map((action) => {
          const { popConfirm } = action
          return {
            size: 'small',
            text: actionText,
            type: actionType,
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel
          }
        })
      })

      function isIfShow(action: ActionItem): boolean {
        const ifShow = action.ifShow

        let isIfShow = true

        if (isBoolean(ifShow)) {
          isIfShow = ifShow
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(action)
        }
        return isIfShow
      }

      const getActions = computed(() => {
        return (toRaw(props.actions) || [])
          .filter((action) => {
            return isIfShow(action)
          })
          .map((action) => {
            const { popConfirm } = action
            // 需要展示什么风格，自己修改一下参数
            return {
              size: 'small',
              text: actionText,
              type: actionType,
              ...action,
              ...(popConfirm || {}),
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
              enable: !!popConfirm
            }
          })
      })

      return {
        getActions,
        getDropdownList,
        getMoreProps
      }
    }
  })
</script>

<template>
  <div class="tableAction">
    <div class="flex items-center justify-center">
      <template v-for="action in getActions" :key="`${action.label}`">
        <n-button v-bind="action as any" class="mx-2">
          {{ action.label }}
          <template v-if="action.hasOwnProperty('icon')" #icon>
            <svg-icon :src="action.icon!" />
          </template>
        </n-button>
      </template>
      <n-dropdown
        v-if="dropDownActions && getDropdownList.length"
        trigger="hover"
        :options="getDropdownList as any"
        @select="select"
      >
        <slot name="more" />
        <n-button v-if="!$slots.more" v-bind="getMoreProps as any" class="mx-2" icon-placement="right">
          <div class="flex items-center">
            <span>更多</span>
            <svg-icon size="14" class="ml-1" src="ri:arrow-down-double-line" />
          </div>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>
