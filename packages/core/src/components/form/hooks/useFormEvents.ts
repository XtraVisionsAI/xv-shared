/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { ComputedRef, Ref } from 'vue'
import type { FormActionType, FormProps, FormSchema } from '../types/form'
import { toRaw, unref } from 'vue'

import { isAsyncFunction, isFunction } from '../../../utils/is'

declare type EmitType = (event: string | any, ...args: any[]) => void

interface UseFormActionContext {
  emit: EmitType
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  formElRef: Ref<FormActionType>
  defaultFormModel: Recordable
  loadingSub: Ref<boolean>
  handleFormValues: Fn
}

export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  formElRef,
  defaultFormModel,
  loadingSub,
  handleFormValues
}: UseFormActionContext) {
  // 验证
  async function validate() {
    return unref(formElRef)?.validate()
  }

  // 提交
  async function handleSubmit(e?: Event): Promise<boolean> {
    if (e) e.preventDefault()
    loadingSub.value = true
    const { submitFunc } = unref(getProps)

    if (submitFunc && isAsyncFunction(submitFunc)) {
      return await submitFunc()
    }
    const formEl = unref(formElRef)
    if (!formEl) return true
    try {
      await validate()
      loadingSub.value = false
      emit('submit', formModel)
      return true
    } catch {
      loadingSub.value = false
      return false
    }
  }

  // 清空校验
  async function clearValidate() {
    // @ts-ignore
    await unref(formElRef)?.restoreValidation()
  }

  // 重置
  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps)
    if (resetFunc && isFunction(resetFunc)) await resetFunc()

    const formEl = unref(formElRef)
    if (!formEl) return
    Object.keys(formModel).forEach((key) => {
      formModel[key] = unref(defaultFormModel)[key] || null
    })
    await clearValidate()
    const fromValues = handleFormValues(toRaw(unref(formModel)))
    emit('reset', fromValues)
    if (submitOnReset) await handleSubmit()
  }

  // 获取表单值
  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return handleFormValues(toRaw(unref(formModel)))
  }

  // 设置表单字段值
  async function setFieldsValue(values: Recordable): Promise<void> {
    const fields = unref(getSchema)
      .map((item) => item.field)
      .filter(Boolean)

    Object.keys(values).forEach((key) => {
      const value = values[key]
      if (fields.includes(key)) {
        formModel[key] = value
      }
    })
  }

  return {
    handleSubmit,
    validate,
    resetFields,
    getFieldsValue,
    clearValidate,
    setFieldsValue
  }
}
