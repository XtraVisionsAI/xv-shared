/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { Recordable } from '../types'

import { unref } from 'vue'

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  // eslint-disable-next-line array-callback-return
  Object.keys(props as any).map((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}

/**
 * Lightweight prop-type helpers (no vue-types dependency).
 *
 * Usage:  propTypes.bool.def(true)
 */
function makePropType<T>(type: any) {
  return {
    type,
    def(defaultValue: T) {
      return { type, default: defaultValue }
    }
  }
}

export const propTypes = {
  bool: makePropType<boolean>(Boolean),
  number: makePropType<number>(Number),
  string: makePropType<string>(String),
  object: makePropType<object>(Object),
  func: makePropType<(...args: any[]) => any>(Function)
}
