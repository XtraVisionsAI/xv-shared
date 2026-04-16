<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { useTimeoutFn } from '@vueuse/core'
  import { useThemeVars } from 'naive-ui'
  import { reactive, unref, useTemplateRef, watch, watchEffect } from 'vue'
  import SliderCaptchaAction from './slider-captcha-action.vue'
  import SliderCaptchaBar from './slider-captcha-bar.vue'
  import SliderCaptchaContent from './slider-captcha-content.vue'

  export interface CaptchaVerifyPassingData {
    isPassing: boolean
    time: number | string
  }

  export interface SliderCaptchaProps {
    class?: ClassType
    /**
     * @description 滑块的样式
     * @default {}
     */
    actionStyle?: CSSProperties

    /**
     * @description 滑块条的样式
     * @default {}
     */
    barStyle?: CSSProperties

    /**
     * @description 内容的样式
     * @default {}
     */
    contentStyle?: CSSProperties

    /**
     * @description 组件的样式
     * @default {}
     */
    wrapperStyle?: CSSProperties

    /**
     * @description 是否作为插槽使用，用于联动组件，可参考旋转校验组件
     * @default false
     */
    isSlot?: boolean

    /**
     * @description 验证成功的提示
     * @default '验证通过'
     */
    successText?: string

    /**
     * @description 提示文字
     * @default '请按住滑块拖动'
     */
    text?: string
  }

  export interface SliderCaptchaActionType {
    resume: () => void
  }

  export interface SliderVerifyPassingData {
    event: MouseEvent | TouchEvent
    moveDistance: number
    moveX: number
  }

  const modelValue = defineModel<boolean>({ default: false })

  const props = withDefaults(defineProps<SliderCaptchaProps>(), {
    actionStyle: () => ({}),
    barStyle: () => ({}),
    contentStyle: () => ({}),
    isSlot: false,
    successText: '验证通过',
    text: '请按住滑块拖动',
    wrapperStyle: () => ({})
  })

  const emit = defineEmits<{
    end: [MouseEvent | TouchEvent]
    move: [SliderVerifyPassingData]
    start: [MouseEvent | TouchEvent]
    success: [CaptchaVerifyPassingData]
  }>()

  const state = reactive({
    endTime: 0,
    isMoving: false,
    isPassing: false,
    moveDistance: 0,
    startTime: 0,
    toLeft: false
  })

  const themeVars = useThemeVars()
  const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef')
  const barRef = useTemplateRef<typeof SliderCaptchaBar>('barRef')
  const contentRef = useTemplateRef<typeof SliderCaptchaContent>('contentRef')
  const actionRef = useTemplateRef<typeof SliderCaptchaAction>('actionRef')

  watch(
    () => state.isPassing,
    (isPassing) => {
      if (isPassing) {
        const { endTime, startTime } = state
        const time = (endTime - startTime) / 1000
        emit('success', { isPassing, time: time.toFixed(1) })
        modelValue.value = isPassing
      }
    }
  )

  watchEffect(() => {
    state.isPassing = !!modelValue.value
  })

  function getEventPageX(e: MouseEvent | TouchEvent): number {
    if ('pageX' in e) {
      return e.pageX
    } else if ('touches' in e && e.touches[0]) {
      return e.touches[0].pageX
    }
    return 0
  }

  function handleDragStart(e: MouseEvent | TouchEvent) {
    if (state.isPassing) {
      return
    }
    if (!actionRef.value) return
    emit('start', e)

    state.moveDistance =
      getEventPageX(e) - Number.parseInt(actionRef.value.getStyle().left.replace('px', '') || '0', 10)
    state.startTime = Date.now()
    state.isMoving = true
  }

  function getOffset(actionEl: HTMLDivElement) {
    const wrapperWidth = wrapperRef.value?.offsetWidth ?? 220
    const actionWidth = actionEl?.offsetWidth ?? 40
    const offset = wrapperWidth - actionWidth - 6
    return { actionWidth, offset, wrapperWidth }
  }

  function handleDragMoving(e: MouseEvent | TouchEvent) {
    const { isMoving, moveDistance } = state
    if (isMoving) {
      const actionEl = unref(actionRef)
      const barEl = unref(barRef)
      if (!actionEl || !barEl) return
      const { actionWidth, offset, wrapperWidth } = getOffset(actionEl.getEl())
      const moveX = getEventPageX(e) - moveDistance

      emit('move', {
        event: e,
        moveDistance,
        moveX
      })
      if (moveX > 0 && moveX <= offset) {
        actionEl.setLeft(`${moveX}px`)
        barEl.setWidth(`${moveX}px`)
      } else if (moveX > offset) {
        actionEl.setLeft(`${wrapperWidth - actionWidth}px`)
        barEl.setWidth(`${wrapperWidth - actionWidth}px`)
        if (!props.isSlot) {
          checkPass()
        }
      }
    }
  }

  function handleDragOver(e: MouseEvent | TouchEvent) {
    const { isMoving, isPassing, moveDistance } = state
    if (isMoving && !isPassing) {
      emit('end', e)
      const actionEl = actionRef.value
      const barEl = unref(barRef)
      if (!actionEl || !barEl) return
      const moveX = getEventPageX(e) - moveDistance
      const { actionWidth, offset, wrapperWidth } = getOffset(actionEl.getEl())
      if (moveX < offset) {
        if (props.isSlot) {
          setTimeout(() => {
            if (modelValue.value) {
              const contentEl = unref(contentRef)
              if (contentEl) {
                contentEl.getEl().style.width = `${Number.parseInt(barEl.getEl().style.width)}px`
              }
            } else {
              resume()
            }
          }, 0)
        } else {
          resume()
        }
      } else {
        actionEl.setLeft(`${wrapperWidth - actionWidth}px`)
        barEl.setWidth(`${wrapperWidth - actionWidth}px`)
        checkPass()
      }
      state.isMoving = false
    }
  }

  function checkPass() {
    if (props.isSlot) {
      resume()
      return
    }
    state.endTime = Date.now()
    state.isPassing = true
    state.isMoving = false
  }

  function resume() {
    state.isMoving = false
    state.isPassing = false
    state.moveDistance = 0
    state.toLeft = false
    state.startTime = 0
    state.endTime = 0
    const actionEl = unref(actionRef)
    const barEl = unref(barRef)
    const contentEl = unref(contentRef)
    if (!actionEl || !barEl || !contentEl) return

    contentEl.getEl().style.width = '100%'
    state.toLeft = true
    useTimeoutFn(() => {
      state.toLeft = false
      actionEl.setLeft('0')
      barEl.setWidth('0')
    }, 30)
  }

  defineExpose({
    resume
  })
</script>

<template>
  <div
    ref="wrapperRef"
    class="captcha-container"
    :class="props.class"
    :style="wrapperStyle"
    @mouseleave="handleDragOver"
    @mousemove="handleDragMoving"
    @mouseup="handleDragOver"
    @touchend="handleDragOver"
    @touchmove="handleDragMoving"
  >
    <slider-captcha-bar ref="barRef" :bar-style="barStyle" :to-left="state.toLeft" />
    <slider-captcha-content
      ref="contentRef"
      :content-style="contentStyle"
      :is-passing="state.isPassing"
      :success-text="successText"
      :text="text"
    >
      <template v-if="$slots.text" #text>
        <slot :is-passing="state.isPassing" name="text" />
      </template>
    </slider-captcha-content>

    <slider-captcha-action
      ref="actionRef"
      :action-style="actionStyle"
      :is-passing="state.isPassing"
      :to-left="state.toLeft"
      @mousedown="handleDragStart"
      @touchstart="handleDragStart"
    >
      <template v-if="$slots.actionIcon" #icon>
        <slot :is-passing="state.isPassing" name="actionIcon" />
      </template>
    </slider-captcha-action>
  </div>
</template>

<style lang="scss" scoped>
  .captcha-container {
    @apply relative h-10 w-full flex items-center overflow-hidden border text-center;
    border-radius: v-bind('themeVars.borderRadius');
    background-color: v-bind('themeVars.inputColor');
    color: v-bind('themeVars.clearColor');
  }
</style>
