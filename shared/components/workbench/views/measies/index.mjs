import { Fragment, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Popout } from 'shared/components/popout/index.mjs'

// Size Chart Picker Component
const SizeChartPicker = ({ selectSize, selectedSize }) => {
  const sizes = [0, 2, 4, 6, 8, 10, 12, 14, 16];

  // Check if the selected size is NOT in the predefined list
  const isCustom = !sizes.includes(selectedSize);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {/* Predefined Sizes */}
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

      {/* Custom Size Button */}
      <button
        onClick={() => selectSize(selectedSize)} // Clicking "Custom" doesn't change size
        className={`px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 ${
          isCustom ? 'border-blue-500 animate-pulse' : ''
        }`}
      >
        Custom
      </button>
    </div>
  );
};


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
  const [selectedSize, setSelectedSize] = useState(6)
  const [selectedBodyType, setSelectedBodyType] = useState("Standard")
  const [adjustedMeasurements, setAdjustedMeasurements] = useState(null)

    // Reset function to revert everything to default values
  const resetValues = () => {
    setSelectedSize(6);
    setSelectedBodyType("Standard");
    setAdjustedMeasurements(interpolateMeasurements(6));
    console.log("🔄 Reset to defaults: Size 6, Standard body type");
  };

  const sizeMeasurements = {
    0: { bust: 30, waist: 24, hip: 33, len: 50, width: 50 },
    2: { bust: 31, waist: 25, hip: 34, len: 52, width: 52 },
    4: { bust: 32, waist: 26, hip: 35, len: 54, width: 54 },
    6: { bust: 34, waist: 28, hip: 37, len: 56, width: 56 },
    8: { bust: 36, waist: 30, hip: 39, len: 58, width: 58 },
    10: { bust: 38, waist: 32, hip: 41, len: 60, width: 60 },
    12: { bust: 40, waist: 34, hip: 43, len: 62, width: 62 },
    14: { bust: 42, waist: 36, hip: 45, len: 64, width: 64 },
    16: { bust: 44, waist: 38, hip: 47, len: 66, width: 66 },
  }

  const getClosestLowerSize = (size) => {
    const sizes = Object.keys(sizeMeasurements).map(Number); // Convert object keys to numbers
    return Math.max(...sizes.filter(s => s <= size)); // Find largest valid size <= input size
  };
  
  const getClosestUpperSize = (size) => {
    const sizes = Object.keys(sizeMeasurements).map(Number); // Convert object keys to numbers
    return Math.min(...sizes.filter(s => s >= size)); // Find smallest valid size >= input size
  };
  

  const interpolateMeasurements = (size) => {
    console.log("what size?", size)

    const lowerSize = getClosestLowerSize(size); 
    const upperSize = getClosestUpperSize(size);
    
    console.log("lowerSize?", lowerSize);
    console.log("upperSize?", upperSize);

    if (size === lowerSize) {
      console.log("✅ Exact size match! Returning without interpolation.");
      return sizeMeasurements[lowerSize];
    }

    const ratio = (size-lowerSize) / (upperSize-lowerSize)
    console.log("Whats my ratio?", ratio)
    const lowerMeasurements = sizeMeasurements[lowerSize];
    const upperMeasurements = sizeMeasurements[upperSize];
  
    return {
      bust: lowerMeasurements.bust + ratio * (upperMeasurements.bust - lowerMeasurements.bust),
      waist: lowerMeasurements.waist + ratio * (upperMeasurements.waist - lowerMeasurements.waist),
      hip: lowerMeasurements.hip + ratio * (upperMeasurements.hip - lowerMeasurements.hip),
      len: lowerMeasurements.len + ratio * (upperMeasurements.len - lowerMeasurements.len),
      width: lowerMeasurements.width + ratio * (upperMeasurements.width - lowerMeasurements.width),
    };
  };
  

  // Update measurements when size or body type changes
  useEffect(() => {
    const newMeasurements = interpolateMeasurements(selectedSize);

    if (newMeasurements) {
      let adjusted = { ...newMeasurements };
  
      // Petite 조정 적용
      if (selectedBodyType === 'Petite' || selectedBodyType === 'Petite-Curvy') {
        adjusted.len -= 10;
        adjusted.width -= 10;
      }
  
      setAdjustedMeasurements(adjusted); 
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

        {/* Size Adjustment Slider */}
        <h5>Fine Tune Your Size</h5>
        <input
          type="range"
          min="0"
          max="16"
          step="0.5"
          value={selectedSize}
          onChange={(e) => setSelectedSize(parseFloat(e.target.value))}
          className="w-full mt-2"
        />
        <p>Selected Size: <strong>{selectedSize}</strong></p>

        <h5>{t('BodyType')}</h5>
        <p>
          {selectedBodyType 
            ? <span>You selected: <strong>{selectedBodyType}</strong></span>
            : t('bodytype description')}
        </p>

        <div className="flex flex-col gap-4">

          <BodyTypePicker selectBodyType={setSelectedBodyType} selectedBodyType={selectedBodyType} />
          
          <button
            onClick={resetValues}
            className="w-28 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Reset
          </button>

        </div>

        {/* Show adjusted measurements for debugging */}
        {adjustedMeasurements && (
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <p><strong>Current Body Measurements (in mm):</strong></p>
            <p>Bust: {adjustedMeasurements.bust}</p>
            <p>Waist: {adjustedMeasurements.waist}</p>
            <p>Hip: {adjustedMeasurements.hip}</p>
            <p>Length: {adjustedMeasurements.len}</p>
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
            {t('Go to Pattern Editor')}
          </button>
        </div>
      </Fragment>
    </div>
  )
}
