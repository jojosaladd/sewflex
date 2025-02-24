import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Popout } from 'shared/components/popout/index.mjs';
import astmData from 'shared/components/measurements/astm.json';

const SizeChartPicker = ({ selectSize, selectedSize }) => {
  const sizes = Object.keys(astmData).map(Number).sort((a, b) => a - b);

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

export const MeasiesView = ({ update, setView, Design, settings }) => {
  const { t } = useTranslation(['workbench']);
  const [selectedSize, setSelectedSize] = useState(6);
  const [selectedBodyType, setSelectedBodyType] = useState("Standard");
  const [adjustedMeasurements, setAdjustedMeasurements] = useState(null);

  // Get the list of measurements required for the current pattern
  const requiredMeasurements = Design?.patternConfig?.measurements || [];

  // Toggle Units Function
  const toggleUnits = () => {
    const newUnit = settings.units === 'imperial' ? 'metric' : 'imperial';
    update.settings(['units'], newUnit);
  };

  // Convert measurements based on unit system
  const convertMeasurement = (value) => {
    return settings.units === 'imperial' ? (value / 25.4).toFixed(2) : value / 10; // Convert mm to inches if imperial
  };

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
        adjusted.chest -= 500;
        adjusted.waist -= 500;
      }

      setAdjustedMeasurements(adjusted);
    }
  }, [selectedSize, selectedBodyType]);

  // Filter adjustedMeasurements to show only the ones needed for the current pattern
  const relevantMeasurements = adjustedMeasurements
    ? Object.keys(adjustedMeasurements)
        .filter(key => requiredMeasurements.includes(key))
        .reduce((obj, key) => {
          obj[key] = adjustedMeasurements[key];
          return obj;
        }, {})
    : {};

  const handleNext = () => {
    update.settings([
      [['measurements'], adjustedMeasurements],
      [['units'], settings.units], // Ensure correct units are stored
      [['bodytype'], selectedBodyType || 'Standard']
    ]);
    setView('draft');
  };

  return (
    <div className="max-w-7xl mt-8 mx-auto px-4">
      <h2>{t('account:measurements')}</h2>

      {/* Unit System Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleUnits}
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-focus transition"
        >
          {settings.units === 'imperial' ? "Switch to Metric (cm)" : "Switch to Imperial (inches)"}
        </button>
      </div>

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

        {/* Show only measurements required by the current pattern */}
        {Object.keys(relevantMeasurements).length > 0 && (
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <p><strong>Current Body Measurements (cm):</strong></p>
            {Object.entries(relevantMeasurements).map(([key, value]) => (
              <p 
                key={key} 
                data-measurement={key} // This will help link it to the SVG later
                className="hover:text-blue-500 cursor-pointer" // Temporary hover effect
              >
                {key}: {convertMeasurement(value)}
              </p>
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
