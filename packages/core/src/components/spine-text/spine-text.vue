<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script lang="ts" setup>
  import { computed } from 'vue'

  const { animationDuration = 2, animationIterationCount = 'infinite' } = defineProps<{
    // 动画持续时间，单位秒
    animationDuration?: number
    // 动画是否只执行一次
    animationIterationCount?: 'infinite' | number
  }>()

  const style = computed(() => {
    return {
      animation: `shine ${animationDuration}s linear ${animationIterationCount}`,
      backgroundSize: '200% 100%'
    }
  })
</script>

<template>
  <n-gradient-text type="info" :style="style" class="text-transparent !flex !bg-clip-text">
    <slot></slot>
  </n-gradient-text>
</template>

<style lang="scss">
  @keyframes shine {
    0% {
      background-position: 200% 0;
    }

    100% {
      background-position: -200% 0%;
    }
  }
</style>
