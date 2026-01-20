import { defineNuxtModule, addImports, addPlugin, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  id: string
  scriptSrc: string
  noscriptSrc: string
  debug: boolean
}

const defaultOptions: Partial<ModuleOptions> = {
  id: 'xxx',
  debug: import.meta.env.NODE_ENV !== 'production',
  scriptSrc: 'https://top-fwz1.mail.ru/js/code.js',
  noscriptSrc: 'https://top-fwz1.mail.ru/counter',
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vk-pixel',
    configKey: 'vkPixel',
  },
  moduleDependencies() {
    return {
      '@nuxt/scripts': {},
    }
  },
  defaults: defaultOptions,
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.vkPixel = {
      ...(nuxt.options.runtimeConfig.public.vkPixel ?? {}),
      ...defaultOptions,
      ...options,
    }

    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/plugin'))

    addImports({
      name: 'useVkPixel',
      as: 'useVkPixel',
      from: resolver.resolve('./runtime/composable'),
    })
  },
})
