import { nsMerge } from 'shared/utils.mjs'
// Hooks
import { useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { useTheme } from 'shared/hooks/use-theme.mjs'
// Context
import { ModalContext } from 'shared/context/modal-context.mjs'
// Components
import {
  DocsIcon,
  LockIcon,
  ThemeIcon,
  I18nIcon,
  GitHubIcon,
  HelpIcon,
  HomeIcon,
  RocketIcon,
} from 'shared/components/icons.mjs'
import { HeaderWrapper } from 'shared/components/wrappers/header.mjs'
import { ModalThemePicker, ns as themeNs } from 'shared/components/modal/theme-picker.mjs'
import { ModalLocalePicker, ns as localeNs } from 'shared/components/modal/locale-picker.mjs'
import { ModalDesignPicker } from './design-picker.mjs'

import { NavButton, NavSpacer } from 'shared/components/header.mjs'

export const ns = nsMerge('sde', 'header', 'sections', 'susi', themeNs, localeNs)

const NavIcons = ({ setModal }) => {
  const { t } = useTranslation(['header'])
  const { spectrum } = useTheme()
  const iconSize = 'h-6 w-6 lg:h-12 lg:w-12'

  return (
    <>
      <NavButton href="/" label={t('header:home')} color={spectrum[1]}>
        <HomeIcon className={iconSize} />
      </NavButton>
      <NavSpacer />
      <NavButton
        onClick={() => setModal(<ModalDesignPicker />)}
        label={t('sde:design')}
        color={spectrum[2]}
      >
        <RocketIcon className={iconSize} />
      </NavButton>
      <NavButton href="/instructions" label="Instructions" color={spectrum[3]}>
        <DocsIcon className={iconSize} />
      </NavButton>
      {/*<NavButton
        href="http://github.com/freesewing/freesewing"
        label={t('Consent Form')}
        color={spectrum[4]}
      >
        <GitHubIcon className={iconSize} />
      </NavButton> */}
      {/* <NavButton href="https://freesewing.org/support" label={t('sde:support')} color={spectrum[5]}>
        <HelpIcon className={iconSize} />
      </NavButton>
      <NavSpacer /> */}
      {/* { <NavButton //theme picker
        onClick={() => setModal(<ModalThemePicker />)}
        label={t('header:theme')}
        color={spectrum[6]}>
          <ThemeIcon className={iconSize} />
        </NavButton> } */}
        {/* <NavButton
          onClick={() => setModal(<ModalLocalePicker />)}
          label={t('header:language')}
          color={spectrum[7]}
        >
        <I18nIcon className={iconSize} />
      </NavButton> */}
      {/* <NavSpacer />
      <NavButton href="/signin" label={t('susi:signIn')} color={spectrum[8]}>
        <LockIcon className={iconSize} />
      </NavButton> */}
    </>
  )
}

export const Header = ({ setSearch, show }) => {
  const { setModal } = useContext(ModalContext)

  return (
    <HeaderWrapper {...{ setSearch, show }}>
      <div className="m-auto md:px-8">
        <div className="p-0 flex flex-row gap-2 justify-between text-neutral-content items-center">
          {/* Non-mobile content */}
          <div className="hidden lg:flex lg:flex-row lg:justify-between items-center xl:justify-center w-full">
            <NavIcons setModal={setModal} setSearch={setSearch} />
          </div>

          {/* Mobile content */}
          <div className="flex lg:hidden flex-row items-center justify-between w-full">
            <NavIcons setModal={setModal} setSearch={setSearch} />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  )
}
