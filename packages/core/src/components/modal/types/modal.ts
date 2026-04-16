/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { DialogOptions } from 'naive-ui'

/**
 * @description: 弹窗对外暴露的方法
 */
export interface ModalMethods {
  setProps: (_props: any) => void
  openModal: () => Promise<void>
  closeModal: () => void
  setSubLoading: (_status: boolean) => void
}

/**
 * 支持修改，DialogOptions 參數
 */
export type ModalProps = DialogOptions

export type ModalRegisterFn = (_instance: ModalMethods) => void

export type UseModalReturnType = [ModalRegisterFn, ModalMethods]
