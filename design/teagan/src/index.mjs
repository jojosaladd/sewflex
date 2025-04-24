import { Design, mergeI18n } from '@freesewing/core'
import { i18n as teaganI18n } from '../i18n/index.mjs'
import { back } from './back.mjs'
import { front } from './front.mjs'
import { sleeve } from './sleeve.mjs'
import { square } from './square.mjs'

// Setup our new design
const Teagan = new Design({
  parts: [back, front, sleeve],
})


// Named exports
export { back, front, sleeve, Teagan }
