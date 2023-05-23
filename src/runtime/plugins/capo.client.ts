import { defineNuxtPlugin, useRouter } from '#imports'
import { logWeights } from '../utils/logger'

export default defineNuxtPlugin(() => {
  useRouter().afterEach(() => {
    logWeights(document, window.location.pathname)
  })
})
