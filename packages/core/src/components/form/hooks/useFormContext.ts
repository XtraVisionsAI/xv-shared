/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import { inject, provide } from 'vue'

const key = Symbol('formElRef')

export function createFormContext(instance: any) {
  provide(key, instance)
}

export function useFormContext() {
  return inject(key)
}
