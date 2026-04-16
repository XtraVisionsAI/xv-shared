/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

export interface ResponseInfo<T = any> {
  ok: boolean
  status: number
  headers?: Record<string, any>
  data?: T
}

export type RequestBody =
  | Record<string, any>
  | string
  | FormData
  | Blob
  | ArrayBuffer
  | URLSearchParams
  | ReadableStream
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'stream' | 'text' | 'json'

export interface MethodContext<R extends ResponseType = ResponseType> extends ProgressCallback, StreamCallback {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  headers: Record<string, any>
  data?: RequestBody
  timeout?: number
  retry?: number | false
  retryDelay?: number | ((context: MethodContext<R>) => number)
  retryStatusCodes?: number[] | ((context: MethodContext<R>) => number[])
  responseType?: R
  signal?: AbortSignal
}

export interface Authentication<R extends ResponseType = ResponseType> {
  isExpired: () => boolean
  assign: (context: MethodContext<R>) => void | Promise<void>
  refresh: (context: MethodContext<R>) => void | Promise<void>
}

export interface ProgressCallback {
  onUpload?: (progress: number) => void
  onDownload?: (progress: number) => void
}

export interface Interceptor<T = any, R extends ResponseType = ResponseType> {
  onRequest?: (context: MethodContext<R>) => Promise<void> | void
  onResponse?: (context: MethodContext<R>, response: T) => Promise<any> | any
  onComplete?: (context: MethodContext<R>) => Promise<void> | void
  onError?: (context: MethodContext<R>, error: Error) => Promise<void> | void
}

export interface StreamCallback {
  onStream?: (data: any) => void
}

export interface ErrorDedupeOptions {
  window?: number
  maxCount?: number
  keyGenerator?: (error: Error) => string
}

export interface InitOptions<T = any, R extends ResponseType = ResponseType> extends Interceptor<T, R> {
  baseURL?: string
  timeout?: number
  auth?: Authentication
  retry?: number | false
  retryDelay?: number | ((context: MethodContext<R>) => number)
  retryStatusCodes?: number[] | ((context: MethodContext<R>) => number[])
  dateFormat?: RegExp
  errorDedupe?: ErrorDedupeOptions
}

export interface RequestOptions<T = any, R extends ResponseType = ResponseType>
  extends Omit<InitOptions<T, R>, 'baseURL'>, ProgressCallback, StreamCallback {
  responseType?: R
  signal?: AbortSignal
  headers?: Record<string, any>
  data?: RequestBody
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  ignoreAuth?: boolean
}

export interface ApiResponseError {
  msg: string
  metadata?: any
}

export interface ApiResponse<T = any> {
  status: number
  request_id: string
  error?: ApiResponseError
  data?: T
}
