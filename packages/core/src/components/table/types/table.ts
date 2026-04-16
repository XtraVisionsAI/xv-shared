/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { DataTableBaseColumn, DataTableProps } from 'naive-ui'
import type { Fn, Recordable } from '../../../types'
import type { ComponentType } from './componentType'

export interface BasicColumn extends DataTableBaseColumn {
  // 编辑表格
  edit?: boolean
  editRow?: boolean
  editable?: boolean
  editComponent?: ComponentType
  editComponentProps?: Recordable
  editRule?: boolean | ((_text: string, _record: Recordable) => Promise<string>)
  editValueMap?: (_value: any) => string
  onEditRow?: () => void
  // 权限编码控制是否显示
  auth?: string[]
  // 业务控制是否显示
  ifShow?: boolean | ((_column: BasicColumn) => boolean)
  // 控制是否支持拖拽，默认支持
  draggable?: boolean
}

export interface TableActionType {
  reload: (_opt) => Promise<void>
  emit?: any
  getColumns: (_opt?) => BasicColumn[]
  setColumns: (_columns: BasicColumn[] | string[]) => void
}

export interface BasicTableProps extends DataTableProps {
  title?: string
  dataSource: Fn
  columns: any[]
  pagination: object
  showPagination: boolean
  actionColumn: any[]
  canResize: boolean
  resizeHeightOffset: number
  loading: boolean
}
