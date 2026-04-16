/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { RouteLocationNormalized } from 'vue-router'

type RouteHandler = (route: RouteLocationNormalized) => void

const handlers = new Set<RouteHandler>()
let latestRoute: RouteLocationNormalized | undefined

export function setRouteEmitter(to: RouteLocationNormalized) {
  latestRoute = to
  for (const handler of handlers) {
    handler(to)
  }
}

export function onRouteChange(handler: RouteHandler, immediate = true) {
  handlers.add(handler)
  if (immediate && latestRoute) {
    handler(latestRoute)
  }
}

export function offRouteChange(handler?: RouteHandler) {
  if (handler) {
    handlers.delete(handler)
  } else {
    handlers.clear()
  }
}
