/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

interface LocalStore {
  startTime: number
  expires: number

  [propName: string]: any
}

/**
 * localStorage设置有效期
 * @param name localStorage设置名称
 * @param data 数据对象
 * @param pExpires 有效期(默认100年)
 */
export function setLocal(
  name: string,
  data: Record<string, any> | null,
  pExpires = 1000 * 60 * 60 * 24 * 365 * 100
): void {
  const d = (data ?? {}) as LocalStore
  d.startTime = Date.now()
  d.expires = pExpires
  localStorage.setItem(name, data ? JSON.stringify(data) : '{}')
}

/**
 * 判断localStorage有效期是否失效
 * @param name localStorage设置名称
 */
export async function useLocal(name: string): Promise<LocalStore> {
  return new Promise((resolve, reject) => {
    const local = getLocal<LocalStore>(name)

    if (local.startTime + local.expires < Date.now()) {
      reject(`${name} 已过期`) // eslint-disable-line prefer-promise-reject-errors
    }

    resolve(local)
  })
}

/**
 * 获取localStorage对象并转成对应的类型
 * @param name localStorage设置名称
 */
export function getLocal<T>(name: string): T {
  const l = localStorage.getItem(name)
  return JSON.parse(l !== null ? l : '{}') as unknown as T
}
