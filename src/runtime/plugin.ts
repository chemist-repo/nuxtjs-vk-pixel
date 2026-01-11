import { defineNuxtPlugin, useHead } from '#app'
import { useScript } from '#nuxt-scripts/composables/useScript'
import type { IVkPixelTmr, IPushPayload, IPageViewPayload } from './types'

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

    const vkPixel: IVkPixelTmr = {
      push(payload: Omit<IPushPayload, 'id'>) {
        proxy.push({
          ...payload,
          id,
        })
      },
      pageView(payload: Omit<IPageViewPayload, 'id'>) {
        proxy.pageView({
          ...payload,
          id,
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
