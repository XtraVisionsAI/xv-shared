/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { Component } from 'vue'

import type { ComponentType } from './types/componentType'
import { NCheckbox, NDatePicker, NInput, NInputNumber, NSelect, NSwitch, NTimePicker } from 'naive-ui'

/* eslint-disable ts/no-duplicate-enum-values */
export enum EventEnum {
  NInput = 'on-input',
  NInputNumber = 'on-input',
  NSelect = 'on-update:value',
  NSwitch = 'on-update:value',
  NCheckbox = 'on-update:value',
  NDatePicker = 'on-update:value',
  NTimePicker = 'on-update:value'
}
/* eslint-enable ts/no-duplicate-enum-values */

const componentMap = new Map<ComponentType, Component>()

componentMap.set('NInput', NInput)
componentMap.set('NInputNumber', NInputNumber)
componentMap.set('NSelect', NSelect)
componentMap.set('NSwitch', NSwitch)
componentMap.set('NCheckbox', NCheckbox)
componentMap.set('NDatePicker', NDatePicker)
componentMap.set('NTimePicker', NTimePicker)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
