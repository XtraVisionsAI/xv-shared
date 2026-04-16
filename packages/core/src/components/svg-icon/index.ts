/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import { h } from 'vue'

import SvgIcon from './svg-icon.vue'

export function renderIcon(icon: string, props: any = { size: 18 }) {
  return () => h(SvgIcon, { ...props, src: icon })
}

export { SvgIcon }
