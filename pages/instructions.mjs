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
        Welcome to SewFlex! Watch the instructions video below to get started. 
        If anything is unclear, feel free to reach out to our team for help.
      </p>
      <div className="aspect-video">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/iz9BNS2g4_4?si=alo4mfYnx6qGAL1_"
          title="SewFlex Instructions Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
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
