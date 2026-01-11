import { defineNuxtPlugin, useHead } from '#app'
import { useScript } from '#nuxt-scripts/composables/useScript'
import type { IVkPixel, IVkPixelTmr } from './types'

export default defineNuxtPlugin({
  parallel: true,
  setup(nuxtApp) {
    const { id, scriptSrc, noscriptSrc } = nuxtApp.$config.public.vkPixel ?? {}
    const { proxy } = useScript<IVkPixelTmr>(
      scriptSrc,
      {
        trigger: 'onNuxtReady',
        use() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window._tmr || (window._tmr = [] as any)).push({
            id,
            type: 'pageView',
            url: window.location.href,
            start: (new Date()).getTime(),
          })

          return window._tmr as IVkPixelTmr
        },
      },
    )

    useHead({
      noscript: [
        {
          tagPosition: 'bodyOpen',
          textContent() {
            return `<div><img src="${noscriptSrc}?id=${id};js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div>`
          },
        },
      ],
    })

    const vkPixel: IVkPixel = {
      push(payload) {
        proxy.push({
          type: 'pageView',
          url: window.location.href,
          start: (new Date()).getTime(),
          ...payload,
          id,
        })
      },
      pageView(payload) {
        proxy.pageView({
          id,
          url: payload.url ? payload.url : window.location.href,
          referrer: payload.referrer ? payload.referrer : document.referrer,
        })
      },
    }

    return {
      provide: {
        vkPixel,
      },
    }
  },
})
