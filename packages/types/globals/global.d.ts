/*
 * Copyright (c) 2020-2025 XtraVisions, All rights reserved.
 */

declare interface Fn<T = any, R = T> {
  (..._arg: T[]): R
}

declare type ValueOf<T> = T[keyof T]
declare type Nullable<T> = T | null
declare type Recordable<T = any> = Record<string, T>
declare type ReadonlyRecordable<T = any> = { readonly [key: string]: T }
declare type Indexable<T = any> = { [key: string]: T }
declare type Mutable<T> =
  T extends Record<string, unknown>
    ? {
        -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? Array<Mutable<U>> : Mutable<T[P]>
      }
    : T

declare type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }

declare type ClassType = Array<object | string> | object | string

declare interface ViteEnv {
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
