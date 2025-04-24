// pages/instructions.mjs

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { nsMerge } from 'shared/utils.mjs'
import { useTranslation } from 'next-i18next'
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'

const ns = nsMerge('sde', pageNs)

const InstructionsPage = ({ page }) => {
  const { t } = useTranslation(ns)

  return (
    <PageWrapper {...page} title={false}>
      <div className="max-w-prose text-center">
        <h3>Instructions & Getting Started</h3>
      </div>

      <div className="max-w-prose space-y-4 mt-6">
        <p>
          Welcome to SewFlex! This page is currently under development, but feel free to look around!
        </p>
      </div>
    </PageWrapper>
  )
}

export default InstructionsPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ns)),
      page: {
        locale,
        path: ['instructions'],
      },
    },
  }
}
