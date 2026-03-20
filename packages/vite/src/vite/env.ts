/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

import process from 'node:process'
import { loadEnv } from 'vite'

export interface ViteEnv {
  VITE_PORT: number
  VITE_APP_NAME: string
  VITE_APP_VERSION: string
  VITE_BASE_URL: string
  VITE_API_BASE_URL: string
  VITE_OUTPUT_DIR: string
  VITE_DROP_CONSOLE: boolean
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
  [key: string]: string | number | boolean
}

const defaultEnv = {
  VITE_PORT: 3000,
  VITE_APP_NAME: 'Frontend Application',
  VITE_APP_VERSION: '1.0.0',
  VITE_BASE_URL: '',
  VITE_API_BASE_URL: '',
  VITE_OUTPUT_DIR: 'dist',
  VITE_DROP_CONSOLE: 'true',
  VITE_BUILD_COMPRESS: 'none'
}

function wrapperEnv<T extends ViteEnv>(envConf: Record<string, any>): T {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realValue = typeof envConf[envName] === 'string' ? envConf[envName].replace(/\\n/g, '\n') : envConf[envName]
    realValue = realValue === 'true' ? true : realValue === 'false' ? false : realValue

    if (envName === 'VITE_PORT') {
      realValue = Number(realValue)
    }
    if (envName === 'VITE_PROXY') {
      try {
        realValue = JSON.parse(realValue)
      } catch {}
    }
    ret[envName] = realValue
    process.env[envName] = String(realValue)
  }

  return ret as T
}

export function useEnv<T extends ViteEnv = ViteEnv>(mode: string, envDir: string, prefixes?: string | string[]): T {
  const env = Object.assign(defaultEnv, loadEnv(mode, envDir, prefixes))
  return wrapperEnv<T>(env)
}
