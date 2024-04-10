import { logWeights } from '../utils/logger'
import { defineNuxtPlugin, useRouter } from '#imports'

export default defineNuxtPlugin(() => {
  useRouter().afterEach(() => {
    logWeights(document, window.location.pathname)
  })
})
