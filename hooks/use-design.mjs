import { FromScratch } from 'site/design/from-scratch/src/index.mjs'
import { Tutorial } from 'site/design/tutorial/src/index.mjs'
import { FromBrian } from 'site/design/from-brian/src/index.mjs'
import { FromBent } from 'site/design/from-bent/src/index.mjs'
import { FromTitan } from 'site/design/from-titan/src/index.mjs'
import { FromBella } from 'site/design/from-bella/src/index.mjs'
import { Penelope } from 'site/design/penelope/src/index.mjs'
import { Teagan } from 'site/design/teagan/src/index.mjs'

// import { Penelope } from '@freesewing/penelope';

const designs = {
  // fromscratch: FromScratch,
  penelope: Penelope,
  teagan: Teagan,
  // frombent: FromBent,
  // fromtitan: FromTitan,
  // frombella: FromBella
  //frombreanna: FromBreanna,
}

export const useDesign = (design) => (designs[design] ? designs[design] : false)

export const collection = Object.keys(designs)
