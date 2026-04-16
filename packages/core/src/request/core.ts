/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { MethodContext, ResponseInfo } from './types'

import { HttpError, NetworkErr, TimeoutErr } from './errors'

function getResponseHeaderMap(xhr: XMLHttpRequest) {
  const headers: Record<string, any> = {}

  xhr
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/)
    .map((value) => value.split(/: /))
    .forEach((keyValue) => {
      headers[keyValue[0].trim()] = keyValue[1].trim()
    })

  return headers
}

export function createXHRPromise<T>(url: string, context: MethodContext): Promise<ResponseInfo<T>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // 处理进度回调
    if (context.onUpload && xhr.upload) {
      xhr.upload.onprogress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
          context.onUpload?.((e.loaded / e.total) * 100)
        }
      }
    }

    if (context.onDownload) {
      xhr.onprogress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
          context.onDownload?.(e.loaded / e.total)
        }
      }
    }

    let seenBytes = 0

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 3 && xhr.status === 200) {
        if (context.onStream) {
          const newData = xhr.response.substring(seenBytes)
          seenBytes = xhr.responseText.length

          context.onStream?.(newData)
        }
      }
      if (xhr.readyState === 4 && xhr.status >= 400) {
        context.responseType = 'json' // adjust response type to json when backend response error
      }
    }

    // 处理load事件
    xhr.onload = () => {
      let response: T
      try {
        switch (context.responseType) {
          case 'blob':
            response = xhr.response as T
            break
          case 'text':
            response = xhr.responseText as T
            break
          case 'arraybuffer':
            response = xhr.response as T
            break
          case 'stream':
            response = xhr.response as T
            break
          default: // json
            response = JSON.parse(xhr.responseText)
        }
      } catch {
        // 解析错误时,保留原始响应文本
        reject(new Error(`Failed to parse response: ${xhr.responseText}`))
        return
      }

      const responseInfo = {
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        headers: getResponseHeaderMap(xhr),
        data: response
      }

      // 检查HTTP状态码，4xx和5xx状态码应该被视为错误
      if (xhr.status >= 400) {
        switch (xhr.status) {
          case 401:
            reject(new HttpError(401, '用户未提供有效的认证信息'))
            break
          case 403:
            reject(new HttpError(403, '用户无权访问该资源'))
            break
          case 404:
            reject(new HttpError(404, '未找到指定资源'))
            break
          case 500:
            reject(new HttpError(500, '服务器内部错误'))
            break
          default:
            reject(new HttpError(xhr.status, `HTTP ${xhr.status}: ${xhr.statusText}`))
        }
      } else {
        resolve(responseInfo)
      }
    }

    // 处理错误
    xhr.onerror = () => reject(NetworkErr())
    xhr.ontimeout = () => reject(TimeoutErr())

    // 打开连接
    xhr.open(context.method, url)

    // 设置超时
    if (context.timeout) {
      xhr.timeout = context.timeout
    }

    // 设置响应类型
    if (context.responseType && context.responseType !== 'stream') {
      xhr.responseType = context.responseType
    }

    // 设置请求头
    if (context.headers) {
      Object.entries(context.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value as string)
      })
    }

    // 处理中止信号
    if (context.signal) {
      context.signal.addEventListener('abort', () => xhr.abort())
    }

    // 发送请求
    xhr.send(context.data as any)
  })
}

export function getContentType(data: any): string | undefined {
  if (data === null || data === undefined) {
    return undefined
  }

  // FormData - 返回undefined让浏览器自动设置
  if (data instanceof FormData) {
    return undefined
  }

  // URLSearchParams
  if (data instanceof URLSearchParams) {
    return 'application/x-www-form-urlencoded'
  }

  // Blob/File
  if (data instanceof Blob) {
    return data.type || 'application/octet-stream'
  }

  // ArrayBuffer/TypedArray
  if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
    return 'application/octet-stream'
  }

  // String
  if (typeof data === 'string') {
    try {
      JSON.parse(data)
      return 'application/json'
    } catch {
      return 'text/plain'
    }
  }

  // Object/Array -> JSON
  if (typeof data === 'object') {
    return 'application/json'
  }

  return 'text/plain'
}
