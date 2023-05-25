import { defineNuxtModule, createResolver, addServerPlugin } from '@nuxt/kit'

export interface ModuleOptions {
  // client: boolean
  server: boolean
}

export default defineNuxtModule<ModuleOptions>({
  defaults: () => ({
    // client: nuxt.options.dev,
    server: true,
  }),
  meta: {
    configKey: 'capo',
    name: 'nuxt-capo',
  },
  async setup(options) {
    const resolver = createResolver(import.meta.url)
    // if (options.client) {
    //   addPlugin(resolver.resolve('./runtime/plugins/capo.client'))
    // }
    if (options.server) {
      addServerPlugin(resolver.resolve('./runtime/server/plugins/capo'))
    }
  },
})
