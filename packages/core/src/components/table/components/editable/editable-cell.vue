<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script lang="ts">
  import type { PropType } from 'vue'
  import type { Fn, Recordable } from '../../../../types'
  import type { BasicColumn } from '../../types/table'
  import type { EditRecordRow } from './index'
  import { omit, set } from 'lodash-es'
  import { computed, defineComponent, nextTick, ref, toRaw, unref, watchEffect } from 'vue'
  import clickOutside from '../../../../directives/clickOutside'
  import { isArray, isBoolean, isFunction, isNumber, isString } from '../../../../utils/is'
  import { formatDate } from '../../../../utils/misc'
  import { SvgIcon } from '../../../svg-icon'
  import { EventEnum } from '../../componentMap'
  import { useTableContext } from '../../hooks/useTableContext'
  import { CellComponent } from './cellComponent'
  import { createPlaceholderMessage } from './helper'

  interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  type LabelValueOptions = {
    label: string
    value: any
    disabled: boolean
    [key: string]: string | number | boolean
  }[]

  export default defineComponent({
    name: 'EditableCell',
    components: { CellComponent, SvgIcon },
    directives: {
      clickOutside
    },
    props: {
      value: {
        type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Recordable>,
        default: ''
      },
      record: {
        type: Object as PropType<EditRecordRow>
      },
      column: {
        type: Object as PropType<BasicColumn>,
        default: () => ({})
      },
      index: {
        type: Number
      }
    },
    setup(props) {
      const table = useTableContext()
      const isEdit = ref(false)
      const elRef = ref()
      const ruleVisible = ref(false)
      const ruleMessage = ref('')
      const optionsRef = ref<LabelValueOptions>([])
      const currentValueRef = ref<any>(props.value)
      const defaultValueRef = ref<any>(props.value)

      // const { prefixCls } = useDesign('editable-cell');

      const getComponent = computed(() => props.column?.editComponent || 'NInput')
      const getRule = computed(() => props.column?.editRule)

      const getRuleVisible = computed(() => {
        return unref(ruleMessage) && unref(ruleVisible)
      })

      const getIsCheckComp = computed(() => {
        const component = unref(getComponent)
        return ['NCheckbox', 'NRadio'].includes(component)
      })

      const getComponentProps = computed(() => {
        const compProps = props.column?.editComponentProps ?? {}
        const editComponent = props.column?.editComponent ?? null
        const component = unref(getComponent)
        const apiSelectProps: Recordable = {}

        const isCheckValue = unref(getIsCheckComp)

        const val = unref(currentValueRef)

        let valueField = isCheckValue ? 'checked' : 'value'
        let value = isCheckValue ? (isNumber(val) && isBoolean(val) ? val : !!val) : val

        // if (isString(value) && component === 'NDatePicker') {
        //   value = milliseconds(value as Duration)
        // } else if (isArray(value) && component === 'NDatePicker') {
        //   value = value.map((item) => milliseconds(item))
        // }
        if (component === 'NDatePicker') {
          if (isString(value)) {
            if (compProps.valueFormat) {
              valueField = 'formatted-value'
            } else {
              value = new Date(value as any).getTime()
            }
          } else if (isArray(value)) {
            if (compProps.valueFormat) {
              valueField = 'formatted-value'
            } else {
              value = value.map((item) => new Date(item).getTime())
            }
          }
        }

        const onEvent: any = editComponent ? EventEnum[editComponent] : undefined

        return {
          placeholder: createPlaceholderMessage(unref(getComponent)),
          ...apiSelectProps,
          ...omit(compProps, 'onChange'),
          [onEvent]: handleChange,
          [valueField]: value
        }
      })

      const getValues = computed(() => {
        const { editComponentProps, editValueMap } = props.column

        const value = unref(currentValueRef)

        if (editValueMap && isFunction(editValueMap)) {
          return editValueMap(value)
        }

        const component = unref(getComponent)
        if (!component.includes('NSelect')) {
          return value
        }

        const options: LabelValueOptions = editComponentProps?.options ?? (unref(optionsRef) || [])
        const option = options.find((item) => `${item.value}` === `${value}`)

        return option?.label ?? value
      })

      const getWrapperClass = computed(() => {
        const { align = 'center' } = props.column
        return `edit-cell-align-${align}`
      })

      const getRowEditable = computed(() => {
        const { editable } = props.record || {}
        return !!editable
      })

      watchEffect(() => {
        defaultValueRef.value = props.value
      })

      watchEffect(() => {
        const { editable } = props.column
        if (isBoolean(editable) || isBoolean(unref(getRowEditable))) {
          isEdit.value = !!editable || unref(getRowEditable)
        }
      })

      function handleEdit() {
        if (unref(getRowEditable) || unref(props.column?.editRow)) return
        ruleMessage.value = ''
        isEdit.value = true
        nextTick(() => {
          const el = unref(elRef)
          el?.focus?.()
        })
      }

      async function handleChange(e: any) {
        const component = unref(getComponent)
        const compProps = props.column?.editComponentProps ?? {}
        if (!e) {
          currentValueRef.value = e
        } else if (e?.target && Reflect.has(e.target, 'value')) {
          currentValueRef.value = (e as ChangeEvent).target.value
        } else if (component === 'NCheckbox') {
          currentValueRef.value = (e as ChangeEvent).target.checked
        } else if (isString(e) || isBoolean(e) || isNumber(e)) {
          currentValueRef.value = e
        }

        if (component === 'NDatePicker') {
          if (isNumber(currentValueRef.value)) {
            if (compProps.valueFormat) {
              currentValueRef.value = formatDate(new Date(currentValueRef.value))
            }
          } else if (isArray(currentValueRef.value)) {
            if (compProps.valueFormat) {
              // eslint-disable-next-line array-callback-return
              currentValueRef.value = currentValueRef.value.map((item) => {
                formatDate(new Date(item))
              })
            }
          }
        }

        const onChange = props.column?.editComponentProps?.onChange
        // eslint-disable-next-line prefer-rest-params
        if (onChange && isFunction(onChange)) onChange(...arguments)

        table.emit?.('edit-change', {
          column: props.column,
          value: unref(currentValueRef),
          record: toRaw(props.record)
        })
        await handleSubmiRule()
      }

      async function handleSubmiRule() {
        const { column, record } = props
        const { editRule } = column
        const currentValue = unref(currentValueRef)

        if (editRule) {
          if (isBoolean(editRule) && !currentValue && !isNumber(currentValue)) {
            ruleVisible.value = true
            const component = unref(getComponent)
            ruleMessage.value = createPlaceholderMessage(component)
            return false
          }
          if (isFunction(editRule)) {
            const res = await editRule(currentValue, record as Recordable)
            if (res) {
              ruleMessage.value = res
              ruleVisible.value = true
              return false
            } else {
              ruleMessage.value = ''
              return true
            }
          }
        }
        ruleMessage.value = ''
        return true
      }

      async function handleSubmit(needEmit = true, valid = true) {
        if (valid) {
          const isPass = await handleSubmiRule()
          if (!isPass) return false
        }

        const { column, index, record } = props
        if (!record) return false
        const { key } = column
        const value = unref(currentValueRef)
        if (!key) return

        const dataKey = key as string

        set(record, dataKey, value)
        // const record = await table.updateTableData(index, dataKey, value)
        if (needEmit) table.emit?.('edit-end', { record, index, key, value })
        isEdit.value = false
      }

      async function handleEnter() {
        if (props.column?.editRow) {
          return
        }
        await handleSubmit()
      }

      function handleCancel() {
        isEdit.value = false
        currentValueRef.value = defaultValueRef.value
        const { column, index, record } = props
        const { key } = column
        ruleVisible.value = true
        ruleMessage.value = ''
        table.emit?.('edit-cancel', {
          record,
          index,
          key,
          value: unref(currentValueRef)
        })
      }

      function onClickOutside() {
        if (props.column?.editable || unref(getRowEditable)) {
          return
        }
        const component = unref(getComponent)

        if (component.includes('NInput')) {
          handleCancel()
        }
      }

      // only ApiSelect
      function handleOptionsChange(options: LabelValueOptions) {
        optionsRef.value = options
      }

      function initCbs(cbs: 'submitCbs' | 'validCbs' | 'cancelCbs', handle: Fn) {
        if (props.record) {
          // eslint-disable-next-line vue/no-mutating-props, ts/no-unused-expressions
          isArray(props.record[cbs]) ? props.record[cbs]?.push(handle) : (props.record[cbs] = [handle])
        }
      }

      if (props.record) {
        initCbs('submitCbs', handleSubmit)
        initCbs('validCbs', handleSubmiRule)
        initCbs('cancelCbs', handleCancel)

        if (props.column.key) {
          // eslint-disable-next-line vue/no-mutating-props
          if (!props.record.editValueRefs) props.record.editValueRefs = {}
          // eslint-disable-next-line vue/no-mutating-props
          props.record.editValueRefs[props.column.key] = currentValueRef
        }
        // eslint-disable-next-line vue/no-mutating-props
        props.record.onCancel = () => {
          if (isArray(props.record?.cancelCbs)) props.record?.cancelCbs.forEach((fn) => fn())
        }
        // eslint-disable-next-line vue/no-mutating-props
        props.record.onSubmit = async () => {
          if (isArray(props.record?.submitCbs)) {
            const validFns = (props.record?.validCbs || []).map((fn) => fn())

            const res = await Promise.all(validFns)

            const pass = res.every((item) => !!item)

            if (!pass) return
            const submitFns = props.record?.submitCbs || []
            submitFns.forEach((fn) => fn(false, false))
            table.emit?.('edit-row-end')
            return true
          }
        }
      }

      return {
        isEdit,
        handleEdit,
        currentValueRef,
        handleSubmit,
        handleChange,
        handleCancel,
        elRef,
        getComponent,
        getRule,
        onClickOutside,
        ruleMessage,
        getRuleVisible,
        getComponentProps,
        handleOptionsChange,
        getWrapperClass,
        getRowEditable,
        getValues,
        handleEnter
        // getSize,
      }
    }
  })
</script>

<template>
  <div class="editable-cell">
    <div v-show="!isEdit" class="editable-cell-content" @click="handleEdit">
      {{ getValues }}
      <svg-icon v-if="!column.editRow" class="edit-icon" src="ri:profile-line" />
    </div>
    <div v-show="isEdit" v-click-outside="onClickOutside" class="editable-cell-content flex">
      <div class="editable-cell-content-comp">
        <cell-component
          v-bind="getComponentProps"
          ref="elRef"
          :component="getComponent"
          :popoverVisible="getRuleVisible"
          :ruleMessage="ruleMessage"
          :rule="getRule"
          :class="getWrapperClass"
          @options-change="handleOptionsChange"
          @press-enter="handleEnter"
        />
      </div>
      <div v-if="!getRowEditable" class="editable-cell-action">
        <svg-icon class="mx-2 cursor-pointer" src="ri:checkbox-circle-line" @click="handleSubmit(true, true)" />
        <svg-icon class="mx-2 cursor-pointer" src="ri:close-circle-line" @click="handleCancel()" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .editable-cell {
    &-content {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: auto-phrase;
      white-space: nowrap;
      overflow-wrap: break-word;

      &-comp {
        flex: 1;
      }

      .edit-icon {
        //position: absolute;
        //top: 4px;
        //right: 0;
        display: none;
        width: 20px;
        font-size: 14px;
        cursor: pointer;
      }

      &:hover {
        .edit-icon {
          display: inline-block;
        }
      }
    }

    &-action {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
