/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { InitOptions, MethodContext } from './types'

import { parseDate } from '../utils/misc'
import { HttpClient } from './client'

interface ErrorRecord {
  count: number
  lastTime: number
}

class ErrorDeduplicator {
  private errorMap = new Map<string, ErrorRecord>()
  private readonly window: number
  private readonly maxCount: number
  private readonly keyGenerator: (error: Error) => string

  constructor(options: NonNullable<InitOptions['errorDedupe']>) {
    this.window = options.window ?? 15000
    this.maxCount = options.maxCount ?? 1
    this.keyGenerator = options.keyGenerator ?? ((error: Error) => `${error.constructor.name}_${error.message}`)
  }

  shouldShow(error: Error): boolean {
    const key = this.keyGenerator(error)
    const now = Date.now()
    const record = this.errorMap.get(key)

    if (!record || now - record.lastTime > this.window) {
      this.errorMap.set(key, { count: 1, lastTime: now })
      return true
    }

    if (record.count < this.maxCount) {
      record.count++
      record.lastTime = now
      return true
    }

    return false
  }
}

const defaultDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

export const createInstance = (opt?: InitOptions) => {
  const deduplicator = opt?.errorDedupe ? new ErrorDeduplicator(opt.errorDedupe) : null

  const onRequest = async (context: MethodContext) => {
    context.headers.timestamp = Date.now()
    await opt?.onRequest?.(context)
  }

  const onResponse = async (context: MethodContext, response: any) => {
    if (opt?.onResponse) {
      return opt?.onResponse(context, response)
    }

    const { status, data: respData } = response

    if (status === 200) {
      if (context.responseType === 'blob' || context.responseType === 'text') {
        return respData
      }

      if (respData.data) {
        respData.data = parseDate(respData.data, opt?.dateFormat || defaultDateFormat)
      }
    }

    return respData
  }

  const onError = async (context: MethodContext, error: Error) => {
    if (deduplicator && !deduplicator.shouldShow(error)) {
      return
    }
    return opt?.onError?.(context, error)
  }

  const onComplete = async (context: MethodContext) => {
    opt?.onComplete?.(context)
  }

  const option = { ...opt, onRequest, onResponse, onError, onComplete } as InitOptions

  return new HttpClient(option)
}
