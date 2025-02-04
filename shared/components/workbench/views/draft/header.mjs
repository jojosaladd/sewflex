//  __SDEFILE__ - This file is a dependency for the stand-alone environment
// Dependencies
import { capitalize, shortDate } from 'shared/utils.mjs'
import { controlLevels } from 'shared/config/freesewing.config.mjs'
// Hooks
import { useContext, useMemo } from 'react'
import { useMobileAction } from 'shared/context/mobile-menubar-context.mjs'
import { useTranslation } from 'next-i18next'
import { useBackend } from 'shared/hooks/use-backend.mjs'
// Context
import { LoadingStatusContext } from 'shared/context/loading-status-context.mjs'
// Components
import { PanZoomContext } from 'shared/components/workbench/pattern/pan-zoom-context.mjs'
import {
  PaperlessIcon,
  SaIcon,
  RocketIcon,
  BulletIcon,
  UnitsIcon,
  DetailIcon,
  ResetIcon,
  UploadIcon,
  BookmarkIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ExpandIcon,
  KioskIcon,
} from 'shared/components/icons.mjs'

export const ns = ['common', 'core-settings', 'ui-settings']

const IconButton = ({ Icon, onClick, dflt = true, title, hide = false, extraClasses = '' }) => (
  <div className="tooltip tooltip-bottom tooltip-primary flex items-center" data-tip={title}>
    <button
      onClick={onClick}
      className={`text-${dflt ? 'neutral-content' : 'accent'} hover:text-secondary-focus ${
        hide ? 'invisible' : ''
      } ${extraClasses}`}
      title={title}
    >
      <Icon />
    </button>
  </div>
)

const smZoomClasses =
  '[.mobile-menubar_&]:btn [.mobile-menubar_&]:btn-secondary [.mobile-menubar_&]:btn-circle [.mobile-menubar_&]:my-1'
const ZoomButtons = ({ t, zoomFunctions, zoomed }) => {
  if (!zoomFunctions) return null
  return (
    <div className="flex flex-col lg:flex-row items-center lg:content-center lg:gap-4">
      <IconButton
        Icon={ResetIcon}
        onClick={zoomFunctions.reset}
        title={t('resetZoom')}
        hide={!zoomed}
        extraClasses={smZoomClasses}
      />
      <IconButton
        Icon={ZoomOutIcon}
        onClick={() => zoomFunctions.zoomOut()}
        title={t('zoomOut')}
        dflt
        extraClasses={smZoomClasses}
      />
      <IconButton
        Icon={ZoomInIcon}
        onClick={() => zoomFunctions.zoomIn()}
        title={t('zoomIn')}
        dflt
        extraClasses={smZoomClasses}
      />
    </div>
  )
}

const Spacer = () => <span className="opacity-50">|</span>

export const DraftHeader = ({
  update,
  settings,
  ui,
  control,
  account,
  design,
  setSettings,
  saveAs = false,
}) => {
  const { t } = useTranslation(ns);
  const { zoomFunctions, zoomed } = useContext(PanZoomContext);

  // Keep only zoom buttons and unit toggle button
  const headerZoomButtons = useMemo(
    () => <ZoomButtons {...{ t, zoomFunctions, zoomed }} />,
    [zoomed, t, zoomFunctions]
  );

  return (
    <div className="hidden lg:flex sticky top-0 z-10">
      <div className="hidden lg:flex flex-row flex-wrap gap-4 py-2 w-full bg-neutral text-neutral-content items-center justify-center">
        
        {/* Zoom Buttons */}
        {headerZoomButtons}

        {/* Unit Toggle Button */}
        <button
          onClick={() =>
            update.settings(['units'], settings.units === 'imperial' ? 'metric' : 'imperial')
          }
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-focus transition"
        >
          {settings.units === 'imperial' ? "Imperial (inches)" : "Metric (cm)"}
        </button>
        
      </div>
    </div>
  );
};