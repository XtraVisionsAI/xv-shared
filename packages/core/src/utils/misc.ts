/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import { isDateString, isObject } from './is'

const defaultDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

export function parseDate(body: any, dateFormat: RegExp = defaultDateFormat): any {
  if (body === null || body === undefined) return body
  if (isDateString(body, dateFormat)) return new Date(body)

  for (const key of Object.keys(body)) {
    const value = body[key]
    if (isDateString(value, dateFormat)) {
      body[key] = new Date(value)
    } else if (typeof value === 'object') {
      body[key] = parseDate(value, dateFormat)
    }
  }

  return body
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

export function humanFileSize(size: number): string {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  return `${Number((size / 1024 ** i).toFixed(2))} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`
}

export function formatDate(d?: Date): string {
  if (!d) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
