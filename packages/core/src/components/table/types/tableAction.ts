/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { ButtonProps } from 'naive-ui'
import type { Fn } from '../../../types'

export interface PopConfirm {
  title: string
  okText?: string
  cancelText?: string
  confirm: Fn
  cancel?: Fn
  icon?: string
}

export interface ActionItem extends ButtonProps {
  onClick?: Fn
  label?: string
  color?: 'success' | 'error' | 'warning'
  icon?: string
  popConfirm?: PopConfirm
  disabled?: boolean
  divider?: boolean
  // 权限编码控制是否显示
  auth?: string | string[]
  // 业务控制是否显示
  ifShow?: boolean | ((_action: ActionItem) => boolean)
}
