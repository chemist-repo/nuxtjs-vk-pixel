import { useNuxtApp } from '#app'

export function useVkPixel() {
  const { $vkPixel } = useNuxtApp()
  return $vkPixel
}
