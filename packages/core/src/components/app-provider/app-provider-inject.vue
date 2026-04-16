<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script setup lang="ts">
  import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'

  window.$dialog = useDialog()
  window.$loading = useLoadingBar()
  window.$message = useMessage()
  window.$notification = useNotification()
</script>

<template>
  <slot></slot>
</template>
