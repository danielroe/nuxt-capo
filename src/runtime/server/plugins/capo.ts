import { JSDOM } from 'jsdom'
import type { NitroApp } from 'nitropack'
import { logWeights } from '../../utils/logger'

export default (nitroApp: NitroApp) => {
  if (!process.dev && !process.env.prerender) {
    return
  }

  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (!response.headers?.['content-type']?.startsWith('text/html')) {
      return
    }
    const dom = new JSDOM(response.body)
    return logWeights(dom.window.document, event.path)
  })
}
