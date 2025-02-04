import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { front } from './front.mjs'

/*
 * Create the design
 */
const FromScratch = new Design({
  data: {
    name: 'fromScratch',
    version: '0.0.1',
  },
  parts: [front],
})

export { front, FromScratch, i18n }
