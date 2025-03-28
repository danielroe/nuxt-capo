import { logWeights } from '../utils/logger'
import { defineNuxtPlugin, useRouter } from '#imports'
import type {} from 'nuxt/app'

export default defineNuxtPlugin(() => {
  useRouter().afterEach(() => {
    logWeights(document, window.location.pathname)
  })
})
