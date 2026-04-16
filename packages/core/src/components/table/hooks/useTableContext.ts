/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { ComputedRef, Ref } from 'vue'
import type { Nullable, Recordable } from '../../../types'
import type { BasicTableProps, TableActionType } from '../types/table'
import { inject, provide } from 'vue'

const key = Symbol('s-table')

type Instance = TableActionType & {
  wrapRef: Ref<Nullable<HTMLElement>>
  getBindValues: ComputedRef<Recordable>
}

type RetInstance = Omit<Instance, 'getBindValues'> & {
  getBindValues: ComputedRef<BasicTableProps>
}

export function createTableContext(instance: Instance) {
  provide(key, instance)
}

export function useTableContext(): RetInstance {
  return inject(key) as RetInstance
}
