/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import { NModal } from 'naive-ui'

export const defaultProps = {
  ...NModal.props,
  subBtnText: {
    type: String,
    default: '确认'
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 446
  },
  title: {
    type: String,
    default: ''
  },
  maskClosable: {
    type: Boolean,
    default: false
  },
  preset: {
    type: String,
    default: 'dialog'
  }
}
