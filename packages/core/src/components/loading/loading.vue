<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script lang="ts" setup>
  const props = withDefaults(defineProps<{ text?: string }>(), { text: 'Loading' })
</script>

<template>
  <div class="box absolute h-100vh w-100vw flex justify-center overflow-hidden">
    <div class="loader" :data-text="props.text" />
  </div>
</template>

<style lang="scss" scoped>
  .box {
    .loader {
      position: relative;
      top: calc(50% - 40px);
      width: 150px;
      height: 20px;
      background-color: rgb(255 255 255 / 20%);

      &::before {
        @apply absolute bg-white opacity-100 z-0 w-0 top-0 left-0;

        content: '';
        height: 20px;
        transform-origin: 100% 0;
        animation: loader 10s ease-in-out infinite;
      }

      &::after {
        @apply absolute text-white text-center font-extralight w-full top-0 left-0;

        content: attr(data-text);
        height: 20px;
        font-family: Lato, 'Helvetica Neue', serif;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

  @keyframes loader {
    0% {
      width: 0;
    }

    70% {
      width: 100%;
      opacity: 1;
    }

    90% {
      width: 100%;
      opacity: 0;
    }

    100% {
      width: 0;
      opacity: 0;
    }
  }

  @keyframes loader {
    0% {
      width: 0;
    }

    70% {
      width: 100%;
      opacity: 1;
    }

    90% {
      width: 100%;
      opacity: 0;
    }

    100% {
      width: 0;
      opacity: 0;
    }
  }
</style>
