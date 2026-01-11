import { useNuxtApp } from '#app'
import type { IVkPixel } from './types'

export function useVkPixel(): IVkPixel {
  const { $vkPixel } = useNuxtApp()
  return $vkPixel
}
