import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup } from '@nuxt/test-utils/e2e'
import { useNuxt } from '@nuxt/kit'

const logs: string[] = []

Object.defineProperty(console, 'log', {
  get() {
    return (...args: string[]) =>
      logs.push(
        args
          .join(' ')
          // eslint-disable-next-line no-control-regex
          .replace(/\u001B\[\d+m/g, ''),
      )
  },

  set() {},
})

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  build: true,
  nuxtConfig: {
    vite: {
      $client: {
        build: {
          rollupOptions: {
            output: {
              chunkFileNames: '_nuxt/[name].js',
              entryFileNames: '_nuxt/[name].js',
            },
          },
        },
      },
    },
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
        "> [capo] actual \`<head>\` order for \`/\`: █████████",
        "",
        "█ 11 <meta charset="utf-8">",
        "█ 11 <meta name="viewport" content="width=device-width, initial-scale=1">",
        "█ 10 <title>My page</title>",
        "█ 1 <meta name="description" content="Here is a description.">",
        "█ 4 <link rel="preload" as="fetch" crossorigin="anonymous" href="/_payload.json?test">",
        "█ 1 <link rel="modulepreload" as="script" crossorigin="" href="/_nuxt/entry.js">",
        "█ 2 <link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-404.js">",
        "█ 2 <link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-500.js">",
        "█ 6 <script type="module" src="/_nuxt/entry.js" crossorigin=""></script>",
        "",
        "> [capo] actual \`<head>\` element
      <head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>My page</title>
      <meta name="description" content="Here is a description.">
      <link rel="preload" as="fetch" crossorigin="anonymous" href="/_payload.json?test">
      <link rel="modulepreload" as="script" crossorigin="" href="/_nuxt/entry.js">
      <link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-404.js">
      <link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-500.js">
      <script type="module" src="/_nuxt/entry.js" crossorigin=""></script></head>",
        "",
        "",
        "> [capo] sorted \`<head>\` order for \`/\`: █████████",
        "",
        "█ 11 <meta charset="utf-8">",
        "█ 11 <meta name="viewport" content="width=device-width, initial-scale=1">",
        "█ 10 <title>My page</title>",
        "█ 6 <script type="module" src="/_nuxt/entry.js" crossorigin=""></script>",
        "█ 4 <link rel="preload" as="fetch" crossorigin="anonymous" href="/_payload.json?test">",
        "█ 2 <link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-404.js">",
        "█ 2 <link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-500.js">",
        "█ 1 <meta name="description" content="Here is a description.">",
        "█ 1 <link rel="modulepreload" as="script" crossorigin="" href="/_nuxt/entry.js">",
        "",
        "> [capo] sorted \`<head>\` element
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>My page</title><script type="module" src="/_nuxt/entry.js" crossorigin=""></script><link rel="preload" as="fetch" crossorigin="anonymous" href="/_payload.json?test"><link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-404.js"><link rel="prefetch" as="script" crossorigin="" href="/_nuxt/error-500.js"><meta name="description" content="Here is a description."><link rel="modulepreload" as="script" crossorigin="" href="/_nuxt/entry.js"></head>",
        "",
      ]
    `)
  })
})
