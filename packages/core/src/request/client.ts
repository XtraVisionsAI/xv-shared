/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { InitOptions, Interceptor, MethodContext, RequestOptions, ResponseInfo, ResponseType } from './types'
import { createXHRPromise, getContentType } from './core'
import { HttpError } from './errors'

export class HttpClient {
  private readonly interceptors: Interceptor[] = []
  private readonly options: InitOptions

  constructor(options: InitOptions = {}) {
    this.options = options
    this.interceptors = [
      {
        onRequest: options.onRequest,
        onResponse: options.onResponse,
        onError: options.onError,
        onComplete: options.onComplete
      }
    ]
  }

  private async processRequest(context: MethodContext, requestInterceptor?: Interceptor): Promise<void> {
    const allInterceptors = requestInterceptor ? this.interceptors.concat([requestInterceptor]) : [...this.interceptors]

    for (const interceptor of allInterceptors) {
      if (interceptor.onRequest) {
        await interceptor.onRequest(context)
      }
    }
  }

  private async processResponse<T>(
    context: MethodContext,
    requestInterceptor?: Interceptor,
    response?: ResponseInfo<T>
  ): Promise<T | undefined> {
    const allInterceptors = requestInterceptor ? this.interceptors.concat([requestInterceptor]) : [...this.interceptors]
    let result: T | undefined

    for (const interceptor of allInterceptors) {
      if (interceptor.onResponse) {
        const transformed = await interceptor.onResponse(context, response)
        if (transformed !== undefined) result = transformed as T
      }
    }

    return result
  }

  private async processError(context: MethodContext, error: Error, requestInterceptor?: Interceptor): Promise<void> {
    const allInterceptors = requestInterceptor ? this.interceptors.concat([requestInterceptor]) : [...this.interceptors]

    for (const interceptor of allInterceptors) {
      if (interceptor.onError) {
        await interceptor.onError(context, error)
      }
    }
  }

  private async processComplete(context: MethodContext, requestInterceptor?: Interceptor): Promise<void> {
    const allInterceptors = requestInterceptor ? this.interceptors.concat([requestInterceptor]) : [...this.interceptors]

    for (const interceptor of allInterceptors) {
      if (interceptor.onComplete) {
        await interceptor.onComplete(context)
      }
    }
  }

  private processRequestBody(data: any): any {
    if (data === null || data === undefined) {
      return null
    }

    // FormData、URLSearchParams、Blob、ArrayBuffer等直接传递
    if (
      data instanceof FormData ||
      data instanceof URLSearchParams ||
      data instanceof Blob ||
      data instanceof ArrayBuffer ||
      ArrayBuffer.isView(data)
    ) {
      return data
    }

    // 字符串检查是否为JSON
    if (typeof data === 'string') {
      try {
        JSON.parse(data)
        return data
      } catch {
        return data
      }
    }

    // 对象/数组转换为JSON字符串
    return JSON.stringify(data)
  }

  async Request<T = any, R extends ResponseType = ResponseType>(
    url: string,
    options: RequestOptions<T, R> = { method: 'GET' }
  ): Promise<T> {
    const { onComplete, onResponse, onError, onRequest, ...restOptions } = options
    const mergedOptions = { ...this.options, ...restOptions }
    const fullUrl = `${this.options.baseURL ?? ''}${url}`
    const context: MethodContext<R> = { url, ...mergedOptions } as MethodContext<R>

    if (context.headers === undefined) context.headers = {}

    // 处理请求体和Content-Type
    if (mergedOptions.data !== undefined) {
      const processedBody = this.processRequestBody(mergedOptions.data)
      const contentType = getContentType(mergedOptions.data)

      context.data = processedBody

      // 只在没有手动设置Content-Type时自动设置
      if (contentType && !mergedOptions.headers?.['Content-Type']) {
        context.headers = {
          ...mergedOptions.headers,
          'Content-Type': contentType
        }
      }
    }

    const shouldRetry = (error: unknown): boolean => {
      if (error instanceof HttpError) {
        if (error.statusCode === 0) return true // network/timeout
        const codes =
          typeof context.retryStatusCodes === 'function' ? context.retryStatusCodes(context) : context.retryStatusCodes
        return codes ? codes.includes(error.statusCode) : false
      }
      return false
    }

    try {
      await this.processRequest(context, { onRequest })

      if (!mergedOptions.ignoreAuth) {
        if (mergedOptions.auth?.isExpired()) {
          await mergedOptions.auth?.refresh(context)
        }

        await mergedOptions.auth?.assign(context)
      }

      // 使用XHR实现
      const response = await createXHRPromise<T>(fullUrl, context)

      const transformed = await this.processResponse(context, { onResponse }, response)

      return (transformed !== undefined ? transformed : response.data) as T
    } catch (error) {
      if (shouldRetry(error) && context.retry && context.retry > 0) {
        const retryDelay =
          typeof context.retryDelay === 'function' ? context.retryDelay(context) : context.retryDelay || 1000

        await new Promise((resolve) => setTimeout(resolve, retryDelay))

        return this.Request(url, {
          ...options,
          retry: context.retry - 1
        })
      }

      await this.processError(context, error as Error, { onError })

      throw error
    } finally {
      await this.processComplete(context, { onComplete })
    }
  }

  Get<T = any>(url: string, options?: RequestOptions<T>) {
    return this.Request<T>(url, {
      ...options,
      method: 'GET'
    })
  }

  Post<T = any>(url: string, data?: any, options?: RequestOptions<T>) {
    return this.Request<T>(url, {
      ...options,
      method: 'POST',
      data
    })
  }

  Put<T = any>(url: string, data?: any, options?: RequestOptions<T>) {
    return this.Request<T>(url, {
      ...options,
      method: 'PUT',
      data
    })
  }

  Delete<T = any>(url: string, options?: RequestOptions<T>) {
    return this.Request<T>(url, {
      ...options,
      method: 'DELETE'
    })
  }

  Patch<T = any>(url: string, data?: any, options?: RequestOptions<T>) {
    return this.Request<T>(url, {
      ...options,
      method: 'PATCH',
      data
    })
  }

  Head<T = any>(url: string, options?: RequestOptions<T>) {
    return this.Request<T>(url, {
      ...options,
      method: 'HEAD'
    })
  }

  Options<T = any>(url: string, options?: RequestOptions<T>) {
    return this.Request<T>(url, {
      ...options,
      method: 'OPTIONS'
    })
  }
}
