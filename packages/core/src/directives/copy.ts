/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { Directive, DirectiveBinding } from 'vue'

interface ElType extends HTMLElement {
  copyData: string | number
  __handleClick__: any
}

async function handleClick(this: ElType) {
  try {
    await navigator.clipboard.writeText(String(this.copyData))
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = String(this.copyData)
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
    el.__handleClick__ = handleClick.bind(el)
    el.addEventListener('click', el.__handleClick__)
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  }
}

export default copy
