/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { Nullable } from '../../../types'
import type { ModalMethods, UseModalReturnType } from '../types/modal'
import { tryOnUnmounted } from '@vueuse/core'
import { getCurrentInstance, ref, unref, watch } from 'vue'

import { isDevMode } from '../../../utils/env'
import { getDynamicProps } from '../../../utils/props'

export function useModal(props: any): UseModalReturnType {
  const modalRef = ref<Nullable<ModalMethods>>(null)
  const currentInstance = getCurrentInstance()

  const getInstance = () => {
    const instance = unref(modalRef.value)
    if (!instance) {
      console.error('useModal instance is undefined!')
    }
    return instance
  }

  const register = (modalInstance: ModalMethods) => {
    if (isDevMode())
      tryOnUnmounted(() => {
        modalRef.value = null
      })
    modalRef.value = modalInstance
    currentInstance?.emit('register', modalInstance)

    watch(
      () => props,
      () => {
        if (props) modalInstance.setProps(getDynamicProps(props))
      },
      {
        immediate: true,
        deep: true
      }
    )
  }

  const methods: ModalMethods = {
    setProps: (props): void => {
      getInstance()?.setProps(props)
    },
    openModal: async () => {
      getInstance()?.openModal()
    },
    closeModal: () => {
      getInstance()?.closeModal()
    },
    setSubLoading: (status) => {
      getInstance()?.setSubLoading(status)
    }
  }

  return [register, methods]
}
