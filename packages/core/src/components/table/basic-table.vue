<!--
  - Copyright (c) 2020-2025 XtraVisions, All rights reserved.
  -->

<script lang="ts" setup>
  import type { Nullable } from '../../types'
  import type { BasicTableProps } from './types/table'
  import { useDebounceFn } from '@vueuse/core'
  import { NDataTable, NDivider, NDropdown, NIcon, NSwitch, NTooltip } from 'naive-ui'
  import { computed, nextTick, onMounted, onUnmounted, ref, toRaw, unref } from 'vue'

  import { getViewportOffset } from '../../utils/dom'
  import { isBoolean } from '../../utils/is'
  import { SvgIcon } from '../svg-icon'
  import ColumnSetting from './components/settings/column-setting.vue'
  import { useColumns } from './hooks/useColumns'
  import { useDataSource } from './hooks/useDataSource'
  import { useLoading } from './hooks/useLoading'
  import { usePagination } from './hooks/usePagination'
  import { createTableContext } from './hooks/useTableContext'
  import { basicProps } from './props'

  interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T
  }

  type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

  // eslint-disable-next-line vue/define-props-declaration
  const props = defineProps({ ...basicProps })

  const emit = defineEmits([
    'fetch-success',
    'fetch-error',
    'update:checked-row-keys',
    'edit-end',
    'edit-cancel',
    'edit-row-end',
    'edit-change'
  ])

  const densityOptions = [
    {
      type: 'menu',
      label: '紧凑',
      key: 'small'
    },
    {
      type: 'menu',
      label: '默认',
      key: 'medium'
    },
    {
      type: 'menu',
      label: '宽松',
      key: 'large'
    }
  ]

  const deviceHeight = ref(150)
  const tableElRef = ref<ComponentRef>(null)
  const wrapRef = ref<Nullable<HTMLDivElement>>(null)
  let paginationEl: HTMLElement | null
  const isStriped = ref(props.striped || false)
  const tableData = ref<Record<string, any>[]>([])
  const innerPropsRef = ref<Partial<BasicTableProps>>()

  const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) } as BasicTableProps
  })

  const tableSize = ref(unref(getProps as any).size || 'medium')

  const { getLoading, setLoading } = useLoading(getProps)

  const { getPaginationInfo, setPagination } = usePagination(getProps)

  const { getDataSourceRef, getDataSource, getRowKey, reload } = useDataSource(
    getProps,
    {
      getPaginationInfo,
      setPagination,
      tableData,
      setLoading
    },
    emit
  )

  const { getPageColumns, setColumns, getColumns, getCacheColumns, setCacheColumnsField } = useColumns(getProps)

  // 页码切换
  function updatePage(page) {
    setPagination({ page })
    reload()
  }

  // 分页数量切换
  function updatePageSize(size) {
    setPagination({ page: 1, pageSize: size })
    reload()
  }

  // 密度切换
  function densitySelect(e) {
    tableSize.value = e
  }

  // 获取表格大小
  const getTableSize = computed(() => tableSize.value)

  // 组装表格信息
  const getBindValues = computed(() => {
    const tableData = unref(getDataSourceRef)
    const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto'
    return {
      ...unref(getProps),
      loading: unref(getLoading),
      columns: toRaw(unref(getPageColumns)),
      rowKey: unref(getRowKey),
      data: tableData,
      size: unref(getTableSize),
      remote: true,
      'max-height': maxHeight,
      title: '' // 重置为空 避免绑定到 table 上面
    }
  })

  // 获取分页信息
  const pagination = computed(() => toRaw(unref(getPaginationInfo)))

  function setProps(props: Partial<BasicTableProps>) {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props }
  }

  const setStriped = (value: boolean) => (isStriped.value = value)

  const tableAction = {
    reload,
    setColumns,
    setLoading,
    setProps,
    getColumns,
    getDataSource,
    getPageColumns,
    getCacheColumns,
    setCacheColumnsField,
    emit
  }

  const getCanResize = computed(() => {
    const { canResize } = unref(getProps)
    return canResize
  })

  async function computeTableHeight() {
    const table = unref(tableElRef)
    if (!table) return
    if (!unref(getCanResize)) return
    const tableEl: any = table?.$el
    const headEl = tableEl.querySelector('.n-data-table-thead ')
    const { bottomIncludeBody } = getViewportOffset(headEl)
    const headerH = 64
    let paginationH = 2
    const marginH = 24
    if (!isBoolean(unref(pagination))) {
      paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight
        paginationH += offsetHeight || 0
      } else {
        paginationH += 28
      }
    }
    let height = bottomIncludeBody - (headerH + paginationH + marginH + (props.resizeHeightOffset || 0))
    const maxHeight = props.maxHeight
    height = maxHeight && maxHeight < height ? maxHeight : height
    deviceHeight.value = height
  }

  // Inline replacement for useWindowSizeFn (was from @engine/core)
  const debouncedComputeTableHeight = useDebounceFn(computeTableHeight, 280)
  const handleResize = () => {
    debouncedComputeTableHeight()
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    nextTick(() => {
      computeTableHeight()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  createTableContext({ ...tableAction, wrapRef, getBindValues })

  defineExpose(tableAction)
</script>

<template>
  <div class="table-toolbar">
    <!-- 顶部左侧区域 -->
    <div class="table-toolbar-left flex items-center">
      <template v-if="props.title">
        <div class="table-toolbar-left-title">
          {{ props.title }}
          <n-tooltip v-if="props.titleTooltip" trigger="hover">
            <template #trigger>
              <n-icon size="18" class="ml-1 cursor-pointer text-gray-400">
                <svg-icon :size="18" class="ml-1 cursor-pointer text-gray-400" src="ri:question-fill" />
              </n-icon>
            </template>
            {{ props.titleTooltip }}
          </n-tooltip>
        </div>
      </template>
      <slot name="tableTitle" />
    </div>

    <div class="table-toolbar-right flex items-center leading-none">
      <!-- 顶部右侧区域 -->
      <slot name="toolbar" />

      <!-- 斑马纹 -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon mr-2">
            <n-switch v-model:value="isStriped" @update:value="setStriped" />
          </div>
        </template>
        <span>表格斑马纹</span>
      </n-tooltip>
      <n-divider vertical />

      <!-- 刷新 -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon" @click="reload">
            <n-icon size="18">
              <svg-icon :size="18" src="ri:refresh-fill" />
            </n-icon>
          </div>
        </template>
        <span>刷新</span>
      </n-tooltip>

      <!-- 密度 -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <div class="table-toolbar-right-icon">
            <n-dropdown v-model:value="tableSize" trigger="click" :options="densityOptions" @select="densitySelect">
              <n-icon size="18">
                <svg-icon :size="18" src="ri:expand-height-fill" />
              </n-icon>
            </n-dropdown>
          </div>
        </template>
        <span>密度</span>
      </n-tooltip>

      <!-- 表格设置单独抽离成组件 -->
      <column-setting />
    </div>
  </div>
  <div class="s-table">
    <n-data-table
      ref="tableElRef"
      v-bind="getBindValues"
      :striped="isStriped"
      :pagination="pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data" />
      </template>
    </n-data-table>
  </div>
</template>

<style lang="scss" scoped>
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 16px 0;

    &-left {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;

      &-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        font-weight: 600;
      }
    }

    &-right {
      display: flex;
      flex: 1;
      justify-content: flex-end;

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

  .table-toolbar-inner-popover-title {
    padding: 2px 0;
  }
</style>
