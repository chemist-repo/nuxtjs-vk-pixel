import type { IVkPixelTmr } from './types'

declare global {
  interface Window {
    _tmr?: IVkPixelTmr
  }
  interface NuxtApp {
    $vkPixel: IVkPixelTmr
  }
}

export {}
