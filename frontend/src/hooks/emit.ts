import type { Fn } from '@vueuse/core'
import mitt from 'mitt'
import { onBeforeUnmount } from 'vue'

interface Option {
  name: string
  callback: Fn
}

const emitter = mitt()

export const useEmit = (option?: Option) => {
  if (option) {
    emitter.on(option.name, option.callback)

    onBeforeUnmount(() => {
      emitter.off(option.name)
    })
  }

  return {
    emitter,
  }
}
