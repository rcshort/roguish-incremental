import React from 'react';
import { routes } from '../data/routes';
import { formatNumber } from '../utils/formatting';

const GeneratorList = ({ generators, energy, currentRoute, unlockedNodes, onBuyGenerator }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Generators</h2>
      <div className="space-y-2">
        {generators && generators.map((gen, idx) => {
          const cost = gen.baseCost * Math.pow(1.15, gen.owned);
          const canAfford = energy >= cost;
          
          let isLocked = false;
          if (idx > 0) {
            isLocked = true;
            if (currentRoute === 'expansion' && unlockedNodes) {
              const route = routes.expansion;
              unlockedNodes.forEach(nodeId => {
                const node = route.nodes.find(n => n.id === nodeId);
                if (node && node.effect === 'unlockGenerator' && node.value >= idx) {
                  isLocked = false;
                }
              });
            }
            if (gen.owned > 0) isLocked = false;
          }

          return (
            <button
              key={gen.id}
              onClick={() => !isLocked && onBuyGenerator(idx)}
              disabled={!canAfford || isLocked}
              className={`w-full p-3 rounded text-left transition-colors ${
                isLocked
                  ? 'bg-gray-700 opacity-40 cursor-not-allowed'
                  : canAfford
                  ? 'bg-blue-700 hover:bg-blue-600'
                  : 'bg-gray-700 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">{gen.name}</div>
                  <div className="text-sm text-gray-300">
                    {isLocked ? 'LOCKED' : `+${gen.baseRate}/s`}
                  </div>
                  <div className="text-xs text-gray-400">Owned: {gen.owned}</div>
                </div>
                <div className="text-right">
                  <div className={canAfford && !isLocked ? 'text-green-400' : 'text-gray-400'}>
                    {formatNumber(cost)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GeneratorList;