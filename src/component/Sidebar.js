import React, { useState } from 'react';
import UnitConverter from './functions/UnitConverter';
import ColorPicker from './functions/ColorPicker';
import FontFinder from './functions/FontFinder';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('unitConverter');

  const renderTool = () => {
    switch (activeTab) {
      case 'unitConverter':
        return <UnitConverter />;
      case 'colorPicker':
        return <ColorPicker />;
      case 'fontFinder':
        return <FontFinder />;
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dev Tools</h1>
      </div>
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mx-2">
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === 'unitConverter'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('unitConverter')}
        >
          Unit
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === 'colorPicker'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('colorPicker')}
        >
          Color
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === 'fontFinder'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('fontFinder')}
        >
          Font
        </button>
      </div>
      <div className="flex-1 overflow-y-auto ">
        {renderTool()}
      </div>
    </div>
  );
};

export default Sidebar;
