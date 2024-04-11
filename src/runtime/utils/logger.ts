import {
  red,
  redBright,
  dim,
  yellow,
  yellowBright,
  greenBright,
  green,
  cyan,
  blue,
  magenta,
  gray,
} from 'colorette'

// https://github.com/rviscomi/capo.js/blob/main/capo.js
const ElementWeights = {
  META: 10,
  TITLE: 9,
  PRECONNECT: 8,
  ASYNC_SCRIPT: 7,
  IMPORT_STYLES: 6,
  SYNC_SCRIPT: 5,
  SYNC_STYLES: 4,
  PRELOAD: 3,
  DEFER_SCRIPT: 2,
  PREFETCH_PRERENDER: 1,
  OTHER: 0,
} as const

const ElementDetectors = {
  META: isMeta,
  TITLE: isTitle,
  PRECONNECT: isPreconnect,
  ASYNC_SCRIPT: isAsyncScript,
  IMPORT_STYLES: isImportStyles,
  SYNC_SCRIPT: isSyncScript,
  SYNC_STYLES: isSyncStyles,
  PRELOAD: isPreload,
  DEFER_SCRIPT: isDeferScript,
  PREFETCH_PRERENDER: isPrefetchPrerender,
} as const

// map to colorette colors - GitHub Copilot suggested these
const WEIGHT_COLORS = [
  red, // '#9e0142',
  redBright, // '#d53e4f',
  (r: string) => dim(red(r)), // '#f46d43',
  yellow, // '#fdae61',
  yellowBright, // '#fee08b',
  greenBright, // '#e6f598',
  green, // '#abdda4',
  cyan, // '#66c2a5',
  blue, // '#3288bd',
  magenta, // '#5e4fa2',
  gray, // '#cccccc'
]

function isMeta(element: Element) {
  return element.matches('meta:is([charset], [http-equiv], [name=viewport])')
}

function isTitle(element: Element) {
  return element.matches('title')
}

function isPreconnect(element: Element) {
  return element.matches('link[rel=preconnect]')
}

function isAsyncScript(element: Element) {
  return element.matches('script[async]')
}

function isImportStyles(element: Element) {
  const importRe = /@import/

  if (element.matches('style')) {
    return importRe.test(element.textContent || '')
  }

  /* TODO: Support external stylesheets.
  if (element.matches('link[rel=stylesheet][href]')) {
    let response = fetch(element.href);
    response = response.text();
    return importRe.test(response);
  } */

  return false
}

function isSyncScript(element: Element) {
  return element.matches('script:not([defer],[async],[type*=json])')
}

function isSyncStyles(element: Element) {
  return element.matches('link[rel=stylesheet],style')
}

function isPreload(element: Element) {
  return element.matches('link[rel=preload]')
}

function isDeferScript(element: Element) {
  return element.matches('script[defer]')
}

function isPrefetchPrerender(element: Element) {
  return element.matches('link:is([rel=prefetch], [rel=dns-prefetch], [rel=prerender])')
}

function getWeight(element: Element) {
  for (const [id, detector] of Object.entries(ElementDetectors)) {
    if (detector(element)) {
      return ElementWeights[id as keyof typeof ElementDetectors]
    }
  }

  return ElementWeights.OTHER
}

function getHeadWeights(document: Document) {
  const headChildren = Array.from(document.head.children)
  return headChildren.map((element) => {
    return [element, getWeight(element)] as [Element, number]
  })
}

function visualizeWeights(weights: number[]) {
  return weights.map(weight => WEIGHT_COLORS[10 - weight]('█')).join('')
}

function visualizeWeight(weight: number) {
  return WEIGHT_COLORS[10 - weight]('█')
}

function truncateSource(html: string) {
  return html.replace(/href="\/_nuxt\/([^"]+)\/([^/]+)"/g, 'href="/_nuxt/.../$2"')
}

export function logWeights(document: Document, path: string) {
  const headWeights = getHeadWeights(document)
  const actualViz = visualizeWeights(headWeights.map(([_, weight]) => weight))

  const sortedHead = document.createElement('head')
  const sortedWeights = [...headWeights].sort((a, b) => {
    return b[1] - a[1]
  })
  sortedWeights.forEach(([element, _weight]) => {
    sortedHead.appendChild(element.cloneNode(true))
  })

  const isOptimal
    = document.head.outerHTML.replace(/\s+/g, '') === sortedHead.outerHTML.replace(/\s+/g, '')

  if (isOptimal) {
    console.log(`${greenBright('✓')} [capo] Optimal \`<head>\` order for \`${path}\`: ${actualViz}`)
    return
  }

  console.groupCollapsed(
    `${yellowBright('>')} [capo] actual \`<head>\` order for \`${path}\`: ${actualViz}`,
  )
  console.log()
  headWeights.forEach(([element, weight]) => {
    console.log(
      dim([visualizeWeight(weight), weight + 1, truncateSource(element.outerHTML)].join(' ')),
    )
  })
  console.log()
  console.log(
    `${yellowBright('>')} [capo] actual \`<head>\` element\n` + dim(document.head.outerHTML.trim()),
  )
  console.log()
  console.groupEnd()

  console.log()
  const sortedViz = visualizeWeights(sortedWeights.map(([_, weight]) => weight))

  console.groupCollapsed(
    `${yellowBright('>')} [capo] sorted \`<head>\` order for \`${path}\`: ${sortedViz}`,
  )
  console.log()
  sortedWeights.forEach(([element, weight]) => {
    console.log(
      dim([visualizeWeight(weight), weight + 1, truncateSource(element.outerHTML)].join(' ')),
    )
  })
  console.log()
  console.log(
    `${yellowBright('>')} [capo] sorted \`<head>\` element\n` + dim(sortedHead.outerHTML.trim()),
  )
  console.log()
  console.groupEnd()
}
