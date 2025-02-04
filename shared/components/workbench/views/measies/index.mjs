import { Fragment } from 'react'
import { nsMerge } from 'shared/utils.mjs'
import { ns as authNs } from 'shared/components/wrappers/auth/index.mjs'
import { horFlexClasses } from 'shared/utils.mjs'
import { useTranslation } from 'next-i18next'
import { MeasiesEditor } from './editor.mjs'
import { Popout } from 'shared/components/popout/index.mjs'
import { Accordion } from 'shared/components/accordion.mjs'
import { EditIcon } from 'shared/components/icons.mjs'

// New component: Size Chart Picker
const SizeChartPicker = ({ selectSize }) => {
  const sizes = [0, 2, 4, 6, 8, 10, 12, 14, 16] // Example sizes
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => selectSize(size)}
          className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
        >
          Size {size}
        </button>
      ))}
    </div>
  )
}

export const MeasiesView = ({ design, Design, settings, update, missingMeasurements, setView }) => {
  const { t } = useTranslation(['workbench'])

  const selectSize = (size) => {
    // Example: Preload standard measurements for the chosen size
    const sizeMeasurements = {
      0: { bust: 30, waist: 24, hip: 33, length:50, width:50 },
      2: { bust: 31, waist: 25, hip: 34 },
      4: { bust: 32, waist: 26, hip: 35 },
      6: { bust: 34, waist: 28, hip: 37 },
      8: { bust: 36, waist: 30, hip: 39 },
      10: { bust: 38, waist: 32, hip: 41 },
      12: { bust: 40, waist: 34, hip: 43 },
      14: { bust: 42, waist: 36, hip: 45 },
      16: { bust: 44, waist: 38, hip: 47 },
    }

    update.settings([
      [['measurements'], sizeMeasurements[size] || {}],
      [['units'], 'metric'],
    ])
    setView('draft')
  }

  return (
    <div className="max-w-7xl mt-8 mx-auto px-4">
      <h2>{t('account:measurements')}</h2>

      {missingMeasurements && settings.measurements && Object.keys(settings.measurements).length > 0 && (
        <Popout note dense noP>
          <h5>{t('weLackSomeMeasies', { nr: missingMeasurements.length })}</h5>
          <ol className="list list-inside ml-4 list-decimal">
            {missingMeasurements.map((m, i) => (
              <li key={i}>{t(`measurements:${m}`)}</li>
            ))}
          </ol>
          <p className="text-lg">{t('youCanPickOrEnter')}</p>
        </Popout>
      )}

      {!missingMeasurements && (
        <Popout note ompact>
          <span className="text-lg">{t('measiesOk')}</span>
        </Popout>
      )}

      <Accordion
        items={[
          [
            <Fragment key={1}>
              <div className={horFlexClasses}>
                <h5 id="sizechart">{t('workbench:chooseFromSizeChart')}</h5>
              </div>
              <p>{t('workbench:chooseFromSizeChartDesc')}</p>
            </Fragment>,
            <SizeChartPicker key={2} selectSize={selectSize} />,
            'sizeChart',
          ],
          [
            <Fragment key={1}>
              <div className={horFlexClasses}>
                <h5 id="editmeasies">{t('workbench:editMeasiesByHand')}</h5>
                <EditIcon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 shrink-0" stroke={1.5} />
              </div>
              <p>{t('workbench:editMeasiesByHandDesc')}</p>
            </Fragment>,
            <MeasiesEditor {...{ Design, settings, update }} key={2} />,
            'editor',
          ],
        ]}
      />
    </div>
  )
}
