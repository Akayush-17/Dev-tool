import React, { useState } from 'react';

const UnitConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('px');
  const [outputUnit, setOutputUnit] = useState('em');
  const [result, setResult] = useState('');

  const convertUnit = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('Invalid input');
      return;
    }

    let convertedValue;
    const baseFontSize = 16; // Assuming default browser font size

    switch (`${inputUnit}-${outputUnit}`) {
      case 'px-em':
        convertedValue = value / baseFontSize;
        break;
      case 'em-px':
        convertedValue = value * baseFontSize;
        break;
      case 'px-rem':
        convertedValue = value / baseFontSize;
        break;
      case 'rem-px':
        convertedValue = value * baseFontSize;
        break;
      case 'em-rem':
      case 'rem-em':
        convertedValue = value;
        break;
      default:
        convertedValue = value;
    }

    setResult(`${convertedValue.toFixed(4)} ${outputUnit}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Unit Converter</h2>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter value"
        />
        <select
          value={inputUnit}
          onChange={(e) => setInputUnit(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="px">px</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
        </select>
        <select
          value={outputUnit}
          onChange={(e) => setOutputUnit(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="px">px</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
        </select>
        <button
          onClick={convertUnit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Convert
        </button>
        {result && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            Result: {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitConverter;

