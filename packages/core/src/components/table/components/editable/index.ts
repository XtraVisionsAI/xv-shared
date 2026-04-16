/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { Ref } from 'vue'
import type { Fn, Recordable } from '../../../../types'
import type { BasicColumn } from '../../types/table'

import { h } from 'vue'
import EditableCell from './editable-cell.vue'

export function renderEditCell(column: BasicColumn) {
  return (record: any, index: any) => {
    const _key = column.key
    const value = record[_key]
    record.onEdit = async (edit: boolean, submit = false) => {
      if (!submit) {
        record.editable = edit
      }

      if (!edit && submit) {
        const res = await record.onSubmitEdit?.()
        if (res) {
          record.editable = false
          return true
        }
        return false
      }
      // cancel
      if (!edit && !submit) {
        record.onCancelEdit?.()
      }
      return true
    }
    return h(EditableCell, {
      value,
      record,
      column,
      index
    })
  }
}

export type EditRecordRow<T = Recordable> = Partial<
  {
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>
    editable: boolean
    onCancel: Fn
    onSubmit: Fn
    submitCbs: Fn[]
    cancelCbs: Fn[]
    validCbs: Fn[]
    editValueRefs: Recordable<Ref>
  } & T
>
