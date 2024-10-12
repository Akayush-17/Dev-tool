import React from 'react';
import UnitConverter from './functions/UnitConverter';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dev Tools</h1>
      </div>
      <UnitConverter />
      {/* Add more tools here as needed */}
    </div>
  );
};

export default Sidebar;


