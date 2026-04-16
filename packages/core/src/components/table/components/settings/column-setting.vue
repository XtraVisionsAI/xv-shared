<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script lang="ts">
  import { cloneDeep } from 'lodash-es'
  import { computed, defineComponent, reactive, ref, toRaw, toRefs, unref, watchEffect } from 'vue'
  import Draggable from 'vue-draggable-plus'

  import { SvgIcon } from '../../../svg-icon'
  import { useTableContext } from '../../hooks/useTableContext'

  interface Options {
    title: string
    key: string
    fixed?: boolean | 'left' | 'right'
  }

  export default defineComponent({
    name: 'ColumnSetting',
    components: { SvgIcon, Draggable },
    props: {
      darkMode: {
        type: Boolean,
        default: false
      }
    },
    setup() {
      const table: any = useTableContext()
      const columnsList = ref<Options[]>([])
      const cacheColumnsList = ref<Options[]>([])

      const state = reactive({
        selection: false,
        checkAll: true,
        checkList: [] as any[],
        defaultCheckList: []
      })

      const getSelection = computed(() => {
        return state.selection
      })

      watchEffect(() => {
        const columns = table.getColumns()
        if (columns.length) {
          init()
        }
      })

      // 初始化
      function init() {
        const columns: any[] = getColumns()
        const checkList: any = columns.map((item) => item.key)
        state.checkList = checkList
        state.defaultCheckList = checkList
        const newColumns = columns.filter((item) => item.key !== 'action' && item.title !== '操作')
        if (!columnsList.value.length) {
          columnsList.value = cloneDeep(newColumns)
          cacheColumnsList.value = cloneDeep(newColumns)
        }
      }

      // 切换
      function onChange(checkList) {
        if (state.selection) {
          checkList.unshift('selection')
        }
        setColumns(checkList)
      }

      // 设置
      function setColumns(columns) {
        table.setColumns(columns)
      }

      // 获取
      function getColumns() {
        const newRet: any[] = []
        table.getColumns().forEach((item) => {
          newRet.push({ ...item })
        })
        return newRet
      }

      // 重置
      function resetColumns() {
        state.checkList = [...state.defaultCheckList]
        state.checkAll = true
        const cacheColumnsKeys: any[] = table.getCacheColumns()
        const newColumns = cacheColumnsKeys.map((item) => {
          return {
            ...item,
            fixed: undefined
          }
        })
        setColumns(newColumns)
        columnsList.value = newColumns
      }

      // 全选
      function onCheckAll(e) {
        const checkList = table.getCacheColumns(true)
        if (e) {
          setColumns(checkList)
          state.checkList = checkList
        } else {
          setColumns([])
          state.checkList = []
        }
      }

      // 拖拽排序
      function draggableEnd() {
        const newColumns = toRaw(unref(columnsList))
        columnsList.value = newColumns
        setColumns(newColumns)
      }

      // 勾选列
      function onSelection(e) {
        const checkList = table.getCacheColumns()
        if (e) {
          checkList.unshift({ type: 'selection', key: 'selection' })
          setColumns(checkList)
        } else {
          checkList.splice(0, 1)
          setColumns(checkList)
        }
      }

      function onMove(e) {
        return e.draggedContext.element.draggable !== false
      }

      // 固定
      function fixedColumn(item: any, fixed: boolean | 'left' | 'right' | undefined) {
        if (!state.checkList.includes(item.key)) return
        const columns = getColumns()
        const isFixed = item.fixed === fixed ? undefined : fixed
        const index = columns.findIndex((res) => res.key === item.key)
        if (index !== -1) {
          columns[index].fixed = isFixed
        }
        table.setCacheColumnsField(item.key, { fixed: isFixed })
        columnsList.value[index].fixed = isFixed
        setColumns(columns)
      }

      return {
        ...toRefs(state),
        columnsList,
        onChange,
        onCheckAll,
        onSelection,
        onMove,
        resetColumns,
        fixedColumn,
        draggableEnd,
        getSelection
      }
    }
  })
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="table-toolbar-right-icon cursor-pointer">
        <n-popover trigger="click" :width="230" class="toolbar-popover" placement="bottom-end">
          <template #trigger>
            <svg-icon :size="18" src="ri:settings-3-line" />
          </template>
          <template #header>
            <div class="table-toolbar-inner-popover-title">
              <n-space>
                <n-checkbox v-model:checked="checkAll" @update:checked="onCheckAll"> 列展示 </n-checkbox>
                <n-checkbox v-model:checked="selection" @update:checked="onSelection"> 勾选列 </n-checkbox>
                <n-button text type="info" size="small" class="mt-1" @click="resetColumns"> 重置 </n-button>
              </n-space>
            </div>
          </template>
          <div class="table-toolbar-inner">
            <n-checkbox-group v-model:value="checkList" @update:value="onChange">
              <draggable
                v-model="columnsList"
                animation="300"
                item-key="key"
                filter=".no-draggable"
                :move="onMove"
                @end="draggableEnd"
              >
                <template #item="{ element }">
                  <div
                    class="table-toolbar-inner-checkbox"
                    :class="{
                      'table-toolbar-inner-checkbox-dark': darkMode,
                      'no-draggable': element.draggable === false
                    }"
                  >
                    <span class="drag-icon" :class="{ 'drag-icon-hidden': element.draggable === false }">
                      <svg-icon :size="18" src="ri:drag-move-fill" />
                    </span>
                    <n-checkbox :value="element.key" :label="element.title" />
                    <div class="fixed-item">
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <svg-icon
                            :size="18"
                            :color="element.fixed === 'left' ? '#2080f0' : undefined"
                            class="cursor-pointer"
                            src="ri:expand-left-line"
                            @click="fixedColumn(element, 'left')"
                          />
                        </template>
                        <span>固定到左侧</span>
                      </n-tooltip>
                      <n-divider vertical />
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <svg-icon
                            :size="18"
                            src="ri:expand-right-line"
                            :color="element.fixed === 'right' ? '#2080f0' : undefined"
                            class="cursor-pointer"
                            @click="fixedColumn(element, 'right')"
                          />
                        </template>
                        <span>固定到右侧</span>
                      </n-tooltip>
                    </div>
                  </div>
                </template>
              </draggable>
            </n-checkbox-group>
          </div>
        </n-popover>
      </div>
    </template>
    <span>列设置</span>
  </n-tooltip>
</template>

<style lang="scss">
  .table-toolbar {
    &-inner-popover-title {
      padding: 3px 0;
    }

    &-right {
      &-icon {
        margin-left: 12px;
        color: var(--text-color);
        font-size: 16px;
        cursor: pointer;

        :hover {
          color: #1890ff;
        }
      }
    }
  }

  .table-toolbar-inner {
    &-checkbox {
      display: flex;
      align-items: center;
      padding: 10px 14px;

      &:hover {
        background: #e6f7ff;
      }

      .drag-icon {
        display: inline-flex;
        margin-right: 8px;
        cursor: move;

        &-hidden {
          visibility: hidden;
          cursor: default;
        }
      }

      .fixed-item {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: auto;
      }

      .ant-checkbox-wrapper {
        flex: 1;

        &:hover {
          color: #1890ff !important;
        }
      }
    }

    &-checkbox-dark {
      &:hover {
        background: hsl(0deg 0% 100% / 8%);
      }
    }
  }

  .toolbar-popover {
    .n-popover__content {
      padding: 0;
    }
  }
</style>
