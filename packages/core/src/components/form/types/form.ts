/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { ButtonProps, GridItemProps, GridProps } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { ComponentType } from '.'

export interface FormSchema {
  field: string
  label: string
  labelMessage?: string
  labelMessageStyle?: object | string
  defaultValue?: any
  component?: ComponentType
  componentProps?: any
  slot?: string
  rules?: object | object[]
  giProps?: GridItemProps
  isFull?: boolean
  suffix?: string
}

export interface FormProps {
  model?: Recordable
  labelWidth?: number | string
  schemas?: FormSchema[]
  inline: boolean
  layout?: string
  size: string
  collapsed: boolean
  collapsedRows: number
  disable: boolean
  labelPlacement: string
  isFull: boolean
  showActionButtonGroup?: boolean
  showResetButton?: boolean
  resetButtonOptions?: Partial<ButtonProps>
  showSubmitButton?: boolean
  showAdvancedButton?: boolean
  submitButtonOptions?: Partial<ButtonProps>
  submitButtonText?: string
  resetButtonText?: string
  gridProps?: GridProps
  giProps?: GridItemProps
  resetFunc?: () => Promise<void>
  submitFunc?: () => Promise<boolean>
  submitOnReset?: boolean
  baseGridStyle?: CSSProperties
}

export interface FormActionType {
  submit: () => Promise<any>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  setFieldsValue: (values: Recordable) => Promise<void>
  clearValidate: (name?: string | string[]) => Promise<void>
  getFieldsValue: () => Recordable
  resetFields: () => Promise<void>
  validate: (nameList?: any[]) => Promise<any>
}

export type FormRegisterFn = (formInstance: FormActionType) => void

export type UseFormReturnType = [FormRegisterFn, FormActionType]
