import React from 'react';
import { routes } from '../data/routes';
import { formatNumber } from '../utils/formatting';

const RouteMap = ({ currentRoute, unlockedNodes, energy, onUnlockNode }) => {
  if (!currentRoute) return null;

  const route = routes[currentRoute];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        {route.name}
        <span className="text-sm font-normal text-gray-400 ml-2">
          {route.description}
        </span>
      </h2>
      <div className="space-y-3">
        {route.nodes.map((node, idx) => {
          const isUnlocked = unlockedNodes.includes(node.id);
          const canUnlock = idx === 0 || unlockedNodes.includes(route.nodes[idx - 1].id);
          const canAfford = energy >= node.cost;

          return (
            <div
              key={node.id}
              className={`p-4 rounded border-2 ${
                isUnlocked
                  ? 'bg-green-900 border-green-600'
                  : canUnlock && canAfford
                  ? 'bg-gray-700 border-yellow-500 cursor-pointer hover:bg-gray-600'
                  : 'bg-gray-700 border-gray-600 opacity-50'
              }`}
              onClick={() => canUnlock && canAfford && !isUnlocked && onUnlockNode(node.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{node.name}</div>
                  <div className="text-sm text-gray-400">
                    {node.effect}: {node.effect.includes('Power') || node.effect.includes('Boost') ? `x${node.value}` : `${node.value}x`}
                  </div>
                </div>
                <div className="text-right">
                  {isUnlocked ? (
                    <span className="text-green-400 font-bold">UNLOCKED</span>
                  ) : (
                    <span className={canAfford ? 'text-yellow-400' : 'text-gray-500'}>
                      {formatNumber(node.cost)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteMap;