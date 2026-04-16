<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { useThemeVars } from 'naive-ui'
  import { computed, ref, useTemplateRef } from 'vue'

  import { SvgIcon } from '../svg-icon'

  const props = defineProps<{
    actionStyle: CSSProperties
    isPassing: boolean
    toLeft: boolean
  }>()

  const themeVars = useThemeVars()

  const actionRef = useTemplateRef<HTMLDivElement>('actionRef')

  const left = ref('0')

  const style = computed(() => {
    const { actionStyle } = props
    return {
      ...actionStyle,
      left: left.value
    }
  })

  const isDragging = computed(() => {
    const currentLeft = Number.parseInt(left.value as string)

    return currentLeft > 0 && !props.isPassing
  })

  defineExpose({
    getEl: () => {
      return actionRef.value
    },
    getStyle: () => {
      return actionRef?.value?.style
    },
    setLeft: (val: string) => {
      left.value = val
    }
  })
</script>

<template>
  <div
    ref="actionRef"
    :class="{
      'transition-width !left-0 duration-300': toLeft,
      rounded: isDragging
    }"
    :style="style"
    class="captcha-action-container"
  >
    <div class="inline-flex">
      <slot name="icon">
        <svg-icon v-if="!isPassing" src="ri:arrow-right-double-fill" :size="18" :color="themeVars.textColor1" />
        <svg-icon v-else src="ri:checkbox-circle-fill" :size="18" :color="themeVars.successColor" />
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .captcha-action-container {
    @apply absolute left-0 top-0 h-full flex cursor-move items-center justify-center px-3.5 shadow;
    background-color: v-bind('themeVars.borderColor');
    color: v-bind('themeVars.textColor1');
  }
</style>
