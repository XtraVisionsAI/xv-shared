/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { VNode } from 'vue'
import { Fragment } from 'vue'

export function renderSlotFragments(children?: VNode[]): VNode[] {
  if (!children) return []
  return children.flatMap((child) => {
    if (child.type === Fragment) return renderSlotFragments(child.children as VNode[])

    return [child]
  })
}
