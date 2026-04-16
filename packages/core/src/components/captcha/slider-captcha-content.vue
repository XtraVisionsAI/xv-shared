<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script setup lang="ts">
  import type { CSSProperties } from 'vue'

  import { computed, useTemplateRef } from 'vue'

  import { SpineText } from '../spine-text'

  const props = defineProps<{
    contentStyle: CSSProperties
    isPassing: boolean
    successText: string
    text: string
  }>()

  const contentRef = useTemplateRef<HTMLDivElement>('contentRef')

  const style = computed(() => {
    const { contentStyle } = props

    return {
      ...contentStyle
    }
  })

  defineExpose({
    getEl: () => {
      return contentRef.value
    }
  })
</script>

<template>
  <div
    ref="contentRef"
    :class="{
      [$style.success]: isPassing
    }"
    :style="style"
    class="absolute top-0 size-full flex select-none items-center justify-center"
  >
    <slot name="text">
      <spine-text class="h-full flex items-center">
        {{ isPassing ? successText : text }}
      </spine-text>
    </slot>
  </div>
</template>

<style module lang="scss">
  .success {
    -webkit-text-fill-color: hsl(0deg 0% 98%);
  }
</style>
