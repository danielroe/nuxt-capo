import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { useNuxt } from '@nuxt/kit'

const logs: string[] = []

Object.defineProperty(console, 'log', {
  get() {
    return (...args: string[]) =>
      logs.push(
        args
          .join(' ')
          .replace(/\.[\d\w]+\.js/g, '.[hash].js')
          // eslint-disable-next-line no-control-regex
          .replace(/\u001b\[\d+m/g, '')
      )
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set() {},
})

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  build: true,
  nuxtConfig: {
    hooks: {
      'modules:before'() {
        const nuxt = useNuxt()
        nuxt.options.nitro.prerender = { routes: ['/'] }
      },
    },
  },
})

describe('nuxt-capo', async () => {
  it('shows logs when prerendering', async () => {
    expect(logs).toMatchInlineSnapshot(`
      [
        "> [capo] actual \`<head>\` order for \`/\`: ██████",
        "",
        "█ 11 <meta charset=\\"utf-8\\">",
        "█ 10 <title>My page</title>",
        "█ 11 <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\">",
        "█ 1 <meta name=\\"description\\" content=\\"Here is a description.\\">",
        "█ 1 <link rel=\\"modulepreload\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/entry.[hash].js\\">",
        "█ 2 <link rel=\\"prefetch\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/error-component.[hash].js\\">",
        "",
        "> [capo] actual \`<head>\` element
      <head><meta charset=\\"utf-8\\">
      <title>My page</title>
      <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\">
      <meta name=\\"description\\" content=\\"Here is a description.\\"><link rel=\\"modulepreload\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/entry.[hash].js\\"><link rel=\\"prefetch\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/error-component.[hash].js\\"></head>",
        "",
        "",
        "> [capo] sorted \`<head>\` order for \`/\`: ██████",
        "",
        "█ 11 <meta charset=\\"utf-8\\">",
        "█ 11 <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\">",
        "█ 10 <title>My page</title>",
        "█ 2 <link rel=\\"prefetch\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/error-component.[hash].js\\">",
        "█ 1 <meta name=\\"description\\" content=\\"Here is a description.\\">",
        "█ 1 <link rel=\\"modulepreload\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/entry.[hash].js\\">",
        "",
        "> [capo] sorted \`<head>\` element
      <head><meta charset=\\"utf-8\\"><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\"><title>My page</title><link rel=\\"prefetch\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/error-component.[hash].js\\"><meta name=\\"description\\" content=\\"Here is a description.\\"><link rel=\\"modulepreload\\" as=\\"script\\" crossorigin=\\"\\" href=\\"/_nuxt/entry.[hash].js\\"></head>",
        "",
      ]
    `)
  })
})
