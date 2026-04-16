<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script setup lang="ts">
  import { computed } from 'vue'

  defineOptions({
    name: 'SvgIcon'
  })

  const props = defineProps<{
    src: string
    color?: string
    size?: number | string
    rotate?: number
    flip?: 'horizontal' | 'vertical' | 'both'
  }>()

  const outputType = computed(() => {
    if (/^https?:\/\//.test(props.src)) {
      return 'img'
    } else if (/i-[^:]+:[^:]+/.test(props.src)) {
      return 'unocss'
    } else if (props.src.includes(':') && !props.src.startsWith('local')) {
      return 'iconify'
    } else {
      return 'svg'
    }
  })

  const iconClass = computed(() => {
    if (outputType.value === 'iconify') {
      return `i-${props.src}`
    }
    return props.src
  })

  const style = computed(() => {
    const transform: string[] = []
    if (props.flip) {
      switch (props.flip) {
        case 'horizontal':
          transform.push('rotateY(180deg)')
          break
        case 'vertical':
          transform.push('rotateX(180deg)')
          break
        case 'both':
          transform.push('rotateX(180deg)')
          transform.push('rotateY(180deg)')
          break
      }
    }
    if (props.rotate) {
      transform.push(`rotate(${props.rotate % 360}deg)`)
    }
    return {
      ...(props.color && { color: props.color }),
      ...(props.size && { fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size }),
      ...(props.size && { height: typeof props.size === 'number' ? `${props.size}px` : props.size }),
      ...(props.size && { lineHeight: typeof props.size === 'number' ? `${props.size}px` : props.size }),
      ...(transform.length && { transform: transform.join(' ') })
    }
  })
</script>

<template>
  <i class="relative inline-flex items-center justify-center fill-current" :style="style">
    <i v-if="outputType === 'unocss' || outputType === 'iconify'" :class="iconClass" />
    <svg v-else-if="outputType === 'svg'" class="h-[1em] w-[1em] shrink-0" aria-hidden="true">
      <use :xlink:href="`#icon-${src.replaceAll('local:', '')}`" />
    </svg>
    <img v-else-if="outputType === 'img'" :src="src" alt="" />
  </i>
</template>
