/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

export class HttpError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}

export const NetworkErr = () => new HttpError(0, '网络或服务异常')
export const TimeoutErr = () => new HttpError(0, '连接超时或服务未响应')
