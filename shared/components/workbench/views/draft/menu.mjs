//  __SDEFILE__ - This file is a dependency for the stand-alone environment
// pinkcandy --> easy to search
import {
  DesignOptions,
  ns as designMenuNs,
} from 'shared/components/workbench/menus/design-options/index.mjs'
import {
  CoreSettings,
  ns as coreMenuNs,
} from 'shared/components/workbench/menus/core-settings/index.mjs'
import { UiSettings, ns as uiNs } from 'shared/components/workbench/menus/ui-settings/index.mjs'
import { useTranslation } from 'next-i18next'
import { patternNsFromPatternConfig, nsMerge } from 'shared/utils.mjs'
import { SettingsIcon, OptionsIcon, DesktopIcon } from 'shared/components/icons.mjs'
import { Accordion } from 'shared/components/accordion.mjs'
import {
  FlagsAccordionTitle,
  FlagsAccordionEntries,
} from 'shared/components/workbench/views/flags.mjs'
import { collection } from 'site/hooks/use-design.mjs'
import { AiAssistant } from '../../menus/ai-assistant/index.mjs'
export const ns = nsMerge(coreMenuNs, designMenuNs, uiNs, collection)

export const DraftMenu = ({
  design,
  patternConfig,
  //setSettings,
  settings,
  ui,
  update,
  language,
  account,
  view,
  setView,
  flags = false,
}) => {
  const { t } = useTranslation(nsMerge(ns, patternNsFromPatternConfig(patternConfig)))
  const control = account.control
  const menuProps = {
    design,
    patternConfig,
    settings,
    update,
    language,
    account,
    control,
  }

  const sections = [
    {
      name: 'designOptions',
      ns: 'design-options',
      icon: <OptionsIcon className="w-8 h-8" />,
      menu: <DesignOptions {...menuProps} />,
    },
    // {
    //   name: 'coreSettings',
    //   ns: 'core-settings',
    //   icon: <SettingsIcon className="w-8 h-8" />,
    //   menu: <CoreSettings {...menuProps} />,
    // },
    // {
    //   name: 'uiSettings',
    //   ns: 'ui-settings',
    //   icon: <DesktopIcon className="w-8 h-8" />,
    //   menu: <UiSettings {...menuProps} {...{ ui, view, setView }} />,
    // },
    // {
    //   name: 'aiAssistant',
    //   ns: 'ui-settings',
    //   icon: <DesktopIcon className="w-8 h-8" />,
    //   menu: <AiAssistant />,
    // }
  ]

  const items = []
  if (flags)
    items.push([
      <FlagsAccordionTitle flags={flags} key={1} />,
      <FlagsAccordionEntries {...{ update, control, flags }} key={2} />,
      'flags',
    ])
  items.push(
    ...sections.map((section) => [
      <>
        <h5 className="flex flex-row gap-2 items-center justify-between w-full">
          <span>{t(`${section.ns}:${section.name}.t`)}</span>
          {section.icon}
        </h5>
        <p className="text-left">{t(`${section.ns}:${section.name}.d`)}</p>
      </>,
      section.menu,
      section.name,
    ])
  )

  return (
    <>
      <Accordion items={items} />

      {/* Manually render AiAssistant block */}
      <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-1">
          <h5 className="flex items-center gap-2 text-base font-medium">
            <span>{t('ui-settings:aiAssistant.t')}</span>
            <DesktopIcon className="w-6 h-6" />
          </h5>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {t('ui-settings:aiAssistant.d')}
        </p>
        <AiAssistant />
      </div>
    </>
  )
}
