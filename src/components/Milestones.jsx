import React from 'react';
import { milestones } from '../data/routes';
import { formatNumber } from '../utils/formatting';

const Milestones = ({ milestoneLevel }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Milestones</h2>
      <div className="space-y-2">
        {milestones.map((milestone, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              milestoneLevel >= milestone.level
                ? 'bg-green-900 border border-green-600'
                : 'bg-gray-700 border border-gray-600'
            }`}
          >
            <div className="flex justify-between">
              <span>{milestone.description}</span>
              <span className="text-gray-400">{formatNumber(milestone.threshold)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Milestones;