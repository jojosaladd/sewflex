// Dependencies
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { nsMerge } from 'shared/utils.mjs'
// Hooks
import { useTranslation } from 'next-i18next'
// Components
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'
import { PageLink, WebLink } from 'shared/components/link.mjs'
import { FreeSewingIcon } from 'shared/components/icons.mjs'
import { collection } from 'site/hooks/use-design.mjs'
import { version } from '@freesewing/core'

const ns = nsMerge('sde', pageNs)
/*
 * Each page MUST be wrapped in the PageWrapper component.
 * You also MUST spread props.page into this wrapper component
 * when path and locale come from static props (as here)
 * or set them manually.
 */
const HomePage = ({ page }) => {
  const { t } = useTranslation(ns)

  return (
    <PageWrapper {...page} title={false}>
      <div className="max-w-prose text-center">
        <h1>SewFlex</h1>
        <h3>Automated Pattern Adjustment for Home Sewers</h3>
      </div>
      <div className="max-w-prose">
        <p>Hello, I'm Joanna. Thank you for participating in Part 2: Tool Testing/Interview for my master's thesis study, <strong>"Developing an Automated Pattern Adjustment System for Home Sewers"</strong>.</p>
        <p>We're exploring how to improve fit accuracy for home sewers who don't fit standard pattern sizes. Your participation will help us understand if an automated adjustment tool can make home sewing more accessible and enjoyable.</p>
        <p>Here, we will add more info later? consent form , steps blah blah</p>

      </div>
      <p className="text-center text-sm mt-12 opacity-60">SewFlex is adapted from the FreeSewing open-source project (FreeSewing.dev API) and extends its functionality to provide an intuitive and user-friendly solution for automating pattern adjustments for non-standard petite and curvy body sizing. For more information about this API, please visit the <strong><a href="https://freesewing.dev/" target="_blank" rel="noopener noreferrer">FreeSewing.dev</a></strong>.</p>

    </PageWrapper>
  )
}

export default HomePage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ns)),
      page: {
        locale,
        path: [],
      },
    },
  }
}
