// Dependencies
import { useTranslation } from 'next-i18next'
import { collection } from 'site/hooks/use-design.mjs'
// Components
import { ModalWrapper } from 'shared/components/wrappers/modal.mjs'
import { Link } from 'shared/components/link.mjs'

export const ns = ['sde']

export const ModalDesignPicker = () => {
  const { t } = useTranslation(ns)

  return (
    <ModalWrapper flex="col" justify="top lg:justify-center" slideFrom="left">
      <div className="max-w-xl">
        <h2>{t('Choose Your Design')}</h2>
        <div className="flex flex-row p-4 w-full flex-wrap gap-2">
        {collection.map((d) => (
  <Link href={`/design/${d}`} key={d} className="...">
    <img
      src={`/img/${d}.png`}
      alt={`${d} preview`}
      className="w-full h-40 object-cover rounded-md"
    />
    <div className="text-lg font-bold">{t(`sde:${d}.t`)}</div>
    <div className="normal-case text-base-content">{t(`sde:${d}.d`)}</div>
  </Link>
))}
        </div>
      </div>
    </ModalWrapper>
  )
}
