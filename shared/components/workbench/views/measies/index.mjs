import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Popout } from 'shared/components/popout/index.mjs';
import astmData from 'shared/components/measurements/astm.json';

const SizeChartPicker = ({ selectSize, selectedSize }) => {
  const sizes = Object.keys(astmData).map(Number).sort((a, b) => a - b); // Convert JSON keys to numbers

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
  );
};

const BodyTypePicker = ({ selectBodyType, selectedBodyType }) => {
  const options = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Standard-Curvy', value: 'Standard-Curvy' },
    { label: 'Petite', value: 'Petite' },
    { label: 'Petite-Curvy', value: 'Petite-Curvy' },
  ];

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
  );
};

export const MeasiesView = ({ update, setView }) => {
  const { t } = useTranslation(['workbench']);
  const [selectedSize, setSelectedSize] = useState(6);
  const [selectedBodyType, setSelectedBodyType] = useState("Standard");
  const [adjustedMeasurements, setAdjustedMeasurements] = useState(null);

  // Get the closest smaller and larger size
  const getClosestLowerSize = (size) => Math.max(...Object.keys(astmData).map(Number).filter(s => s <= size));
  const getClosestUpperSize = (size) => Math.min(...Object.keys(astmData).map(Number).filter(s => s >= size));

  // Function to interpolate between sizes
  const interpolateMeasurements = (size) => {
    if (!astmData) return null; // Ensure data is available

    const lowerSize = getClosestLowerSize(size);
    const upperSize = getClosestUpperSize(size);

    if (size === lowerSize) return astmData[lowerSize]; // Exact match

    const ratio = (size - lowerSize) / (upperSize - lowerSize);
    const lowerMeasurements = astmData[lowerSize];
    const upperMeasurements = astmData[upperSize];

    // Linear interpolation for all numeric properties
    const interpolated = {};
    Object.keys(lowerMeasurements).forEach(key => {
      interpolated[key] = lowerMeasurements[key] + ratio * (upperMeasurements[key] - lowerMeasurements[key]);
    });

    return interpolated;
  };

  useEffect(() => {
    const newMeasurements = interpolateMeasurements(selectedSize);
    if (newMeasurements) {
      let adjusted = { ...newMeasurements };

      // Apply Petite adjustments
      if (selectedBodyType === 'Petite' || selectedBodyType === 'Petite-Curvy') {
        adjusted.chest -= 10;
        adjusted.waist -= 10;
      }

      setAdjustedMeasurements(adjusted);
    }
  }, [selectedSize, selectedBodyType]);

  const handleNext = () => {
    update.settings([
      [['measurements'], adjustedMeasurements],
      [['units'], 'metric'],
      [['bodytype'], selectedBodyType || 'Standard']
    ]);
    setView('draft');
  };

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
            onClick={() => setSelectedSize(6)}
            className="w-28 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Reset
          </button>
        </div>

        {/* Show adjusted measurements for debugging */}
        {adjustedMeasurements && (
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <p><strong>Current Body Measurements (in mm):</strong></p>
            {Object.entries(adjustedMeasurements).map(([key, value]) => (
              <p key={key}>{key}: {value.toFixed(2)}</p>
            ))}
          </div>
        )}

        {/* Next button */}
        <div className="mt-4">
          <button
            onClick={handleNext}
            disabled={!adjustedMeasurements}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('Go to Pattern Editor')}
          </button>
        </div>
      </Fragment>
    </div>
  );
};
