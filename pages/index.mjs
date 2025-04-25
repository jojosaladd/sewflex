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

          <div className="max-w-prose space-y-4 mt-6">
      <p>
        Hello, I'm Joanna. <strong>SewFlex</strong> is a tool developed as part of my research project, <strong>"Developing an Automated Pattern Adjustment System for Home Sewers."</strong>
      </p>
      <p>
        This tool aims to make it easier for home sewers, especially those who don’t fit standard pattern sizes or aren’t necessarily tech-savvy, to adjust and customize patterns to their body measurements and style preferences.
      </p>
      <p>
        With SewFlex, you can create a custom-sized pattern using a detailed size chart, adjust design elements with intuitive controls, or get help from the built-in AI assistant.
      </p>
      <p>
        Click the <strong>Design</strong> tab above to get started!
      </p>
    </div>

    {/* <p className="text-center text-sm mt-12 opacity-60">
  SewFlex is adapted from the FreeSewing open-source project (FreeSewing.dev API) and extends its functionality to provide an intuitive, user-friendly solution for automating pattern adjustments. It’s designed especially for non-standard body types, with support from an AI assistant and a detailed size chart.  
  For more information about the API, please visit <strong><a href="https://freesewing.dev/" target="_blank" rel="noopener noreferrer">FreeSewing.dev</a></strong>.
</p> */}
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
