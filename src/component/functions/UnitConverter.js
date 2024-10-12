import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClipboard, FaCopy, FaTicketAlt, FaCheck } from 'react-icons/fa';

const UnitConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('px');
  const [outputUnits, setOutputUnits] = useState(['em']);
  const [results, setResults] = useState({});
  const [copiedStates, setCopiedStates] = useState({});

  const units = ['px', 'rem', 'em', '%', 'vw', 'vh'];

  const convertUnit = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResults({ error: 'Invalid input' });
      return;
    }

    const baseFontSize = 16; 
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const newResults = {};
    outputUnits.forEach(outputUnit => {
      let convertedValue;

      switch (`${inputUnit}-${outputUnit}`) {
        case 'px-em':
        case 'px-rem':
          convertedValue = value / baseFontSize;
          break;
        case 'em-px':
        case 'rem-px':
          convertedValue = value * baseFontSize;
          break;
        case 'px-%':
          convertedValue = (value / baseFontSize) * 100;
          break;
        case '%-px':
          convertedValue = (value * baseFontSize) / 100;
          break;
        case 'px-vw':
          convertedValue = (value / viewportWidth) * 100;
          break;
        case 'vw-px':
          convertedValue = (value * viewportWidth) / 100;
          break;
        case 'px-vh':
          convertedValue = (value / viewportHeight) * 100;
          break;
        case 'vh-px':
          convertedValue = (value * viewportHeight) / 100;
          break;
        default:
          convertedValue = value;
      }

      newResults[outputUnit] = `${convertedValue.toFixed(4)} ${outputUnit}`;
    });

    setResults(newResults);
  };

  const handleOutputUnitChange = (unit) => {
    setOutputUnits(prev => 
      prev.includes(unit) 
        ? prev.filter(u => u !== unit) 
        : [...prev, unit]
    );
  };

  const copyToClipboard = (text, unit) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [unit]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [unit]: false }));
      }, 5000);
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Unit Converter</h2>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Convert to:</h3>
          <div className="flex flex-wrap gap-2">
            {units.map(unit => (
              <label key={unit} className="flex items-center">
                <input
                  type="checkbox"
                  checked={outputUnits.includes(unit)}
                  onChange={() => handleOutputUnitChange(unit)}
                  className="mr-1 form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="text-sm text-gray-700">{unit}</span>
              </label>
            ))}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={convertUnit}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Convert
        </motion.button>
        <div className="mt-4 space-y-2">
          {Object.entries(results).map(([unit, result]) => (
            <motion.div
              key={unit}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
            >
              <div>
                <span className="font-semibold text-gray-700">{unit}:</span> {result}
              </div>
              <button
                onClick={() => copyToClipboard(result, unit)}
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                title="Copy to clipboard"
              >
                {copiedStates[unit] ? <FaCheck className=' h-3 w-3 text-green-400' /> : <FaCopy />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
