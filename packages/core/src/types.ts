/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

export interface Fn<T = any, R = T> {
  (...args: T[]): R
}

export type Nullable<T> = T | null

export type Indexable<T = any> = { [key: string]: T }

export type Recordable<T = any> = Record<string, T>
