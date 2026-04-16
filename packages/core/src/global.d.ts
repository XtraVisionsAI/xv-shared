/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

declare global {
  type Fn<T = any, R = T> = import('./types').Fn<T, R>
  type Nullable<T> = import('./types').Nullable<T>
  type Indexable<T = any> = import('./types').Indexable<T>
  type Recordable<T = any> = import('./types').Recordable<T>
}

export {}
