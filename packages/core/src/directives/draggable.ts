/* Copyright (c) 2020-2025 XtraVisions, All rights reserved. */

import type { Directive } from 'vue'

interface ElType extends HTMLElement {
  parentNode: any
}

const draggable: Directive = {
  mounted(el: ElType) {
    el.style.cursor = 'move'
    el.style.position = 'absolute'

    el.addEventListener('mousedown', (e: MouseEvent) => {
      const disX = e.pageX - el.offsetLeft
      const disY = e.pageY - el.offsetTop

      const onMouseMove = (e: MouseEvent) => {
        let x = e.pageX - disX
        let y = e.pageY - disY
        const maxX = el.parentNode.offsetWidth - el.offsetWidth
        const maxY = el.parentNode.offsetHeight - el.offsetHeight
        if (x < 0) x = 0
        else if (x > maxX) x = maxX
        if (y < 0) y = 0
        else if (y > maxY) y = maxY
        el.style.left = `${x}px`
        el.style.top = `${y}px`
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
  }
}

export default draggable
