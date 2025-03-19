import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Popout } from 'shared/components/popout/index.mjs';
import astmData from 'shared/components/measurements/astm.json';
import measurementDescriptions from 'shared/components/measurements/measurementDescriptions.json';
import Image from 'next/image'; // Import Next.js Image component

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
  const [hoveredMeasurement, setHoveredMeasurement] = useState(null); // Track hover state
  const [hoveredDescription, setHoveredDescription] = useState(""); 
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  
  // Get the list of measurements required for the current pattern
  const requiredMeasurements = Design?.patternConfig?.measurements || [];

  // Toggle Units Function
  const toggleUnits = () => {
    const newUnit = settings.units === 'imperial' ? 'metric' : 'imperial';
    update.settings(['units'], newUnit);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) setEditingMeasurement(null);
  };

  const revertMeasurement = (value) => {
    return settings.units === 'imperial' ? value * 25.4 : value * 10;
  };
  
  const handleDoubleClick = (key, value) => {
    if (!isEditMode) return;
    setEditingMeasurement(key);
    setEditedValue(convertMeasurement(value).toString());  // PRE-FILL with current value

  };

  const handleChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleBlur = (key) => {
    if (editedValue.trim() !== "" && !isNaN(editedValue)) {
      const convertedValue = revertMeasurement(editedValue);
  
      // Update state directly so React knows to re-render
      setAdjustedMeasurements((prev) => ({
        ...prev,
        [key]: parseFloat(convertedValue),
      }));
  
      // Also update global settings if needed
      update.settings(['measurements', key], parseFloat(convertedValue));
      setIsCustom(true);
    }
    setEditingMeasurement(null);
  };
  
  
  const handleKeyDown = (e, key) => {
    if (e.key === "Enter") {
      handleBlur(key);
    }
  };

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".measurement-input")) {
      setEditingMeasurement(null);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

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

      // Apply Petite adjustments UPDATE LATER! 
      // if (selectedBodyType === 'Petite') {
      //   adjusted.chest -= 500;
      //   adjusted.waist -= 500;
      // }

      if (selectedBodyType === 'Standard-Curvy') {
        adjusted.waist -= 38.1;
        adjusted.seat += 19.05;
        adjusted.waistToSeat += 3.18;
        adjusted.waistToHips += 0;
        adjusted.waistToKnee += 0;
        adjusted.waistToArmpit += 0;
        adjusted.hips -= 6.35;
        adjusted.shoulderSlope += 0;
        adjusted.shoulderToShoulder += 0;
        adjusted.neck += 0;
        adjusted.hpsToWaistBack += 0;
        adjusted.hpsToBust += 0;
        adjusted.chest += 0;
        adjusted.biceps += 0; 
      }

      setAdjustedMeasurements(adjusted);
    }
  }, [selectedSize, selectedBodyType]);

  useEffect(() => {
    const svgObject = document.getElementById("avatar-svg");
    if (svgObject) {
      svgObject.addEventListener("load", () => {
        const svgDoc = svgObject.contentDocument;
        if (svgDoc) {
          const layers = svgDoc.querySelectorAll("g[id]:not(#avatar)");
          layers.forEach(layer => layer.style.display = "none");
        }
      });
    }
  }, []);

  useEffect(() => {
    const svgObject = document.getElementById("avatar-svg");
    if (svgObject) {
      const svgDoc = svgObject.contentDocument;
      if (svgDoc) {
        const layers = svgDoc.querySelectorAll("g[id]:not(#avatar)");
        layers.forEach(layer => layer.style.display = "none");
        if (hoveredMeasurement) {
          const activeLayer = svgDoc.getElementById(hoveredMeasurement);
          if (activeLayer) {
            activeLayer.style.display = "block";
          }
        }
      }
    }
  }, [hoveredMeasurement]);


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
    <div className="max-w-7xl mt-8 mx-auto px-4 grid grid-cols-3 gap-8">
  
      {/* LEFT COLUMN: Measurement selection */}
      <div className="pr-4">
        <h2>{t('account:measurements')}</h2>
  
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
          <SizeChartPicker 
            selectSize={(size) => {
              setSelectedSize(size);
              setIsCustom(false);
            }} 
            selectedSize={selectedSize} 
          />
  
          <h5>Fine Tune Your Size</h5>
          <input
            type="range"
            min="0"
            max="16"
            step="0.5"
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(parseFloat(e.target.value));
              setIsCustom(false);
            }}
            className="w-full mt-2"
          />
          <p>Selected Size: <strong>{isCustom ? 'Custom' : selectedSize}</strong></p>
  
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
  
      {/* MIDDLE COLUMN: Measurements */}
      {Object.keys(relevantMeasurements).length > 0 && (
        <div className="p-4 bg-gray-100 border rounded overflow-auto">
          <p><strong>Current Body Measurements:</strong></p>
          <div className="flex justify-start mb-4">
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-focus transition"
            >
              {isEditMode ? "Exit Edit Mode" : "Enable Edit Mode"}
            </button>
          </div>
  
          {Object.entries(relevantMeasurements).map(([key, value]) => (
            <p
            key={key}
            data-measurement={key}
            className="hover:text-blue-500 cursor-pointer"
            onMouseEnter={() => {
              setHoveredMeasurement(key);
              setHoveredDescription(measurementDescriptions[key] || "No description available.");
            }}
            onMouseLeave={() => {
              setHoveredMeasurement(null);
              setHoveredDescription("");
            }}
          >
            <strong>{key}: </strong>
          
            {editingMeasurement === key ? (
              <input
                type="text"
                value={editedValue}
                onChange={handleChange}
                onBlur={() => handleBlur(key)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                className="border border-gray-400 px-1 rounded"
                autoFocus
                onFocus={(e) => e.target.select()}  // This selects all text for easier overwriting

              />
            ) : (
              <span 
                onDoubleClick={(e) => {
                  e.stopPropagation(); // STOP bubbling, super important
                  handleDoubleClick(key, value);
                }}
              >
                {convertMeasurement(value)}
              </span>
            )}
          </p>
          ))}
        </div>
      )}
  
      {/* RIGHT COLUMN: Avatar */}
      <div className="flex flex-col items-center relative overflow-hidden shrink-0">
        <object 
          id="avatar-svg" 
          type="image/svg+xml" 
          data="/img/avatar.svg" 
          className="max-w-[300px] md:max-w-[400px] lg:max-w-[500px] w-full h-auto"
        ></object>
  
        {hoveredDescription && (
          <div className="mt-4 text-center bg-white text-gray-700 text-lg p-4 rounded shadow-md w-[min(90%,500px)] max-w-full break-words">
            {hoveredDescription}
          </div>
        )}
      </div>
  
    </div>
  );
  

};
