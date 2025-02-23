import { Fragment, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Popout } from 'shared/components/popout/index.mjs'

// Size Chart Picker Component
const SizeChartPicker = ({ selectSize, selectedSize }) => {
  const sizes = [0, 2, 4, 6, 8, 10, 12, 14, 16]
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => selectSize(size)}
          className={`px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 ${
            selectedSize === size ? 'border-blue-500' : ''
          }`}
        >
          Size {size}
        </button>
      ))}
    </div>
  )
}

// Body Type Picker Component
const BodyTypePicker = ({ selectBodyType, selectedBodyType }) => {
  const options = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Standard-Curvy', value: 'Standard-Curvy' },
    { label: 'Petite', value: 'Petite' },
    { label: 'Petite-Curvy', value: 'Petite-Curvy' },
  ]

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => selectBodyType(option.value)}
          className={`px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 ${
            selectedBodyType === option.value ? 'border-blue-500' : ''
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export const MeasiesView = ({ update, setView }) => {
  const { t } = useTranslation(['workbench'])
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedBodyType, setSelectedBodyType] = useState(null)
  const [adjustedMeasurements, setAdjustedMeasurements] = useState(null)

  const sizeMeasurements = {
    0: { bust: 30, waist: 24, hip: 33, length: 50, width: 50 },
    2: { bust: 31, waist: 25, hip: 34, length: 52, width: 52 },
    4: { bust: 32, waist: 26, hip: 35, length: 54, width: 54 },
    6: { bust: 34, waist: 28, hip: 37, length: 56, width: 56 },
    8: { bust: 36, waist: 30, hip: 39, length: 58, width: 58 },
    10: { bust: 38, waist: 32, hip: 41, length: 60, width: 60 },
    12: { bust: 40, waist: 34, hip: 43, length: 62, width: 62 },
    14: { bust: 42, waist: 36, hip: 45, length: 64, width: 64 },
    16: { bust: 44, waist: 38, hip: 47, length: 66, width: 66 },
  }

  // Update measurements when size or body type changes
  useEffect(() => {
    if (selectedSize !== null) {
      let newMeasurements = { ...sizeMeasurements[selectedSize] }

      // Adjust for Petite and Petite-Curvy
      if (selectedBodyType === 'Petite' || selectedBodyType === 'Petite-Curvy') {
        newMeasurements.length -= 10
        newMeasurements.width -= 10
      }

      setAdjustedMeasurements(newMeasurements)
    }
  }, [selectedSize, selectedBodyType])

  const handleNext = () => {
    update.settings([
      [['measurements'], adjustedMeasurements],
      [['units'], 'metric'],
      [['bodytype'], selectedBodyType || 'Standard']
    ])
    setView('draft')
  }

  return (
    <div className="max-w-7xl mt-8 mx-auto px-4">
      <h2>{t('account:measurements')}</h2>

      <Fragment>
        <h5>{t('Choose Your Size')}</h5>
        <SizeChartPicker selectSize={setSelectedSize} selectedSize={selectedSize} />

        <h5>{t('BodyType')}</h5>
        <p>
          {selectedBodyType 
            ? <span>You selected <strong>{selectedBodyType}</strong></span>
            : t('bodytype description')}
        </p>
        <BodyTypePicker selectBodyType={setSelectedBodyType} selectedBodyType={selectedBodyType} />

        {/* Show adjusted measurements for debugging */}
        {adjustedMeasurements && (
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <p><strong>Adjusted Measurements:</strong></p>
            <p>Bust: {adjustedMeasurements.bust}</p>
            <p>Waist: {adjustedMeasurements.waist}</p>
            <p>Hip: {adjustedMeasurements.hip}</p>
            <p>Length: {adjustedMeasurements.length}</p>
            <p>Width: {adjustedMeasurements.width}</p>
          </div>
        )}

        {/* Next button */}
        <div className="mt-4">
          <button
            onClick={handleNext}
            disabled={selectedSize === null || selectedBodyType === null}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('next')}
          </button>
        </div>
      </Fragment>
    </div>
  )
}
