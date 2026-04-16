/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { ComponentType } from '../../types/componentType'

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component === 'NInput') return '请输入'
  if (['NPicker', 'NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(component))
    return '请选择'
  return ''
}
