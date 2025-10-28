import React from 'react';
import { formatNumber } from '../utils/formatting';

const EnergyDisplay = ({ energy, totalEnergy, clickPower, passiveRate, onClick }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-blue-400 mb-2">
          {formatNumber(energy)}
        </div>
        <div className="text-gray-400">Energy</div>
        <div className="text-sm text-gray-500 mt-2">
          Total Generated: {formatNumber(totalEnergy)}
        </div>
      </div>

      <button
        onClick={onClick}
        className="w-full py-8 bg-blue-600 hover:bg-blue-700 rounded-lg text-2xl font-bold transition-colors"
      >
        Generate Energy (+{formatNumber(clickPower)})
      </button>

      <div className="mt-4 text-center text-gray-400">
        <div>Per Second: {formatNumber(passiveRate)}</div>
      </div>
    </div>
  );
};

export default EnergyDisplay;