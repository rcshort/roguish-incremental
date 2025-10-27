import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings, RotateCcw } from 'lucide-react';

const IncrementalGame = () => {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('incrementalGameSave');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      energy: 0,
      totalEnergy: 0,
      clickPower: 1,
      passiveRate: 0,
      generators: [],
      currentRoute: null,
      unlockedNodes: [],
      milestoneLevel: 0,
      lastTick: Date.now()
    };
  });

  const [showRouteSelection, setShowRouteSelection] = useState(false);
  const [showRespec, setShowRespec] = useState(false);

  const routes = {
    efficiency: {
      name: 'Efficiency Path',
      color: '#3b82f6',
      description: 'Focus on maximizing output per resource',
      nodes: [
        { id: 'eff1', name: 'Optimizer', cost: 100, effect: 'clickPower', value: 2, unlocked: true },
        { id: 'eff2', name: 'Streamliner', cost: 500, effect: 'passiveBoost', value: 1.5, unlocked: false },
        { id: 'eff3', name: 'Perfectionist', cost: 2000, effect: 'clickPower', value: 5, unlocked: false },
        { id: 'eff4', name: 'Master Optimizer', cost: 10000, effect: 'passiveBoost', value: 2, unlocked: false }
      ]
    },
    expansion: {
      name: 'Expansion Path',
      color: '#10b981',
      description: 'Unlock more generators and parallel systems',
      nodes: [
        { id: 'exp1', name: 'Duplicator', cost: 100, effect: 'unlockGenerator', value: 1, unlocked: true },
        { id: 'exp2', name: 'Network', cost: 500, effect: 'unlockGenerator', value: 2, unlocked: false },
        { id: 'exp3', name: 'Grid System', cost: 2000, effect: 'generatorBoost', value: 1.5, unlocked: false },
        { id: 'exp4', name: 'Mega Complex', cost: 10000, effect: 'unlockGenerator', value: 3, unlocked: false }
      ]
    },
    velocity: {
      name: 'Velocity Path',
      color: '#f59e0b',
      description: 'Increase speed of all operations',
      nodes: [
        { id: 'vel1', name: 'Accelerator', cost: 100, effect: 'tickSpeed', value: 1.2, unlocked: true },
        { id: 'vel2', name: 'Momentum', cost: 500, effect: 'clickSpeed', value: 1.5, unlocked: false },
        { id: 'vel3', name: 'Velocity Core', cost: 2000, effect: 'tickSpeed', value: 1.5, unlocked: false },
        { id: 'vel4', name: 'Time Dilation', cost: 10000, effect: 'allSpeed', value: 2, unlocked: false }
      ]
    }
  };

  const generatorTypes = [
    { id: 0, name: 'Basic Generator', baseCost: 10, baseRate: 1, owned: 0 },
    { id: 1, name: 'Advanced Generator', baseCost: 100, baseRate: 5, owned: 0 },
    { id: 2, name: 'Quantum Generator', baseCost: 1000, baseRate: 25, owned: 0 },
    { id: 3, name: 'Fusion Generator', baseCost: 10000, baseRate: 100, owned: 0 }
  ];

  const milestones = [
    { level: 0, threshold: 0, description: 'Game Start' },
    { level: 1, threshold: 50, description: 'First Route Choice' },
    { level: 2, threshold: 500, description: 'Route Node Unlock' },
    { level: 3, threshold: 2500, description: 'Route Node Unlock' },
    { level: 4, threshold: 12500, description: 'Route Node Unlock' }
  ];

  // Initialize generators if not present
  useEffect(() => {
    if (!gameState.generators || gameState.generators.length === 0) {
      setGameState(prev => ({
        ...prev,
        generators: generatorTypes.map(g => ({ ...g }))
      }));
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('incrementalGameSave', JSON.stringify(gameState));
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [gameState]);

  // Game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        const deltaSeconds = (now - prev.lastTick) / 1000;
        
        let passiveGain = 0;
        if (prev.generators) {
          prev.generators.forEach(gen => {
            passiveGain += gen.owned * gen.baseRate;
          });
        }

        // Apply route bonuses
        let effectivePassiveGain = passiveGain;
        if (prev.currentRoute && prev.unlockedNodes) {
          const route = routes[prev.currentRoute];
          prev.unlockedNodes.forEach(nodeId => {
            const node = route.nodes.find(n => n.id === nodeId);
            if (node) {
              if (node.effect === 'passiveBoost') {
                effectivePassiveGain *= node.value;
              }
              if (node.effect === 'generatorBoost') {
                effectivePassiveGain *= node.value;
              }
              if (node.effect === 'tickSpeed') {
                effectivePassiveGain *= node.value;
              }
              if (node.effect === 'allSpeed') {
                effectivePassiveGain *= node.value;
              }
            }
          });
        }

        const gain = effectivePassiveGain * deltaSeconds;
        const newEnergy = prev.energy + gain;
        const newTotal = prev.totalEnergy + gain;

        // Check for milestone unlock
        let newMilestone = prev.milestoneLevel;
        for (let i = prev.milestoneLevel + 1; i < milestones.length; i++) {
          if (newTotal >= milestones[i].threshold) {
            newMilestone = i;
          }
        }

        return {
          ...prev,
          energy: newEnergy,
          totalEnergy: newTotal,
          milestoneLevel: newMilestone,
          lastTick: now
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Check for route selection prompt
  useEffect(() => {
    if (gameState.milestoneLevel >= 1 && !gameState.currentRoute && !showRouteSelection) {
      setShowRouteSelection(true);
    }
  }, [gameState.milestoneLevel, gameState.currentRoute]);

  const handleClick = () => {
    let effectiveClickPower = gameState.clickPower;
    
    if (gameState.currentRoute && gameState.unlockedNodes) {
      const route = routes[gameState.currentRoute];
      gameState.unlockedNodes.forEach(nodeId => {
        const node = route.nodes.find(n => n.id === nodeId);
        if (node) {
          if (node.effect === 'clickPower') {
            effectiveClickPower *= node.value;
          }
          if (node.effect === 'clickSpeed') {
            effectiveClickPower *= node.value;
          }
          if (node.effect === 'allSpeed') {
            effectiveClickPower *= node.value;
          }
        }
      });
    }

    setGameState(prev => ({
      ...prev,
      energy: prev.energy + effectiveClickPower,
      totalEnergy: prev.totalEnergy + effectiveClickPower
    }));
  };

  const buyGenerator = (genId) => {
    const gen = gameState.generators[genId];
    const cost = gen.baseCost * Math.pow(1.15, gen.owned);
    
    if (gameState.energy >= cost) {
      setGameState(prev => ({
        ...prev,
        energy: prev.energy - cost,
        generators: prev.generators.map((g, i) => 
          i === genId ? { ...g, owned: g.owned + 1 } : g
        )
      }));
    }
  };

  const selectRoute = (routeKey) => {
    setGameState(prev => ({
      ...prev,
      currentRoute: routeKey,
      unlockedNodes: []
    }));
    setShowRouteSelection(false);
  };

  const unlockNode = (nodeId) => {
    const route = routes[gameState.currentRoute];
    const node = route.nodes.find(n => n.id === nodeId);
    
    if (node && gameState.energy >= node.cost && !gameState.unlockedNodes.includes(nodeId)) {
      const nodeIndex = route.nodes.findIndex(n => n.id === nodeId);
      const canUnlock = nodeIndex === 0 || gameState.unlockedNodes.includes(route.nodes[nodeIndex - 1].id);
      
      if (canUnlock) {
        setGameState(prev => ({
          ...prev,
          energy: prev.energy - node.cost,
          unlockedNodes: [...prev.unlockedNodes, nodeId]
        }));
      }
    }
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('incrementalGameSave');
      window.location.reload();
    }
  };

  const respecRoute = () => {
    if (gameState.currentRoute) {
      const route = routes[gameState.currentRoute];
      let refund = 0;
      gameState.unlockedNodes.forEach(nodeId => {
        const node = route.nodes.find(n => n.id === nodeId);
        if (node) refund += node.cost * 0.75; // 75% refund
      });

      setGameState(prev => ({
        ...prev,
        currentRoute: null,
        unlockedNodes: [],
        energy: prev.energy + refund
      }));
      setShowRespec(false);
      setShowRouteSelection(true);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e6) return num.toExponential(2);
    return Math.floor(num).toLocaleString();
  };

  const getCurrentRoute = () => {
    return gameState.currentRoute ? routes[gameState.currentRoute] : null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Route Incremental</h1>
          <div className="flex gap-2">
            {gameState.currentRoute && (
              <button
                onClick={() => setShowRespec(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Respec
              </button>
            )}
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
            >
              <Settings size={16} />
              Reset
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Display */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-blue-400 mb-2">
                  {formatNumber(gameState.energy)}
                </div>
                <div className="text-gray-400">Energy</div>
                <div className="text-sm text-gray-500 mt-2">
                  Total Generated: {formatNumber(gameState.totalEnergy)}
                </div>
              </div>

              <button
                onClick={handleClick}
                className="w-full py-8 bg-blue-600 hover:bg-blue-700 rounded-lg text-2xl font-bold transition-colors"
              >
                Generate Energy (+{formatNumber(gameState.clickPower)})
              </button>

              <div className="mt-4 text-center text-gray-400">
                <div>Per Second: {formatNumber(gameState.generators.reduce((sum, g) => sum + (g.owned * g.baseRate), 0))}</div>
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Milestones</h2>
              <div className="space-y-2">
                {milestones.map((milestone, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded ${
                      gameState.milestoneLevel >= milestone.level
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

            {/* Route Map */}
            {gameState.currentRoute && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">
                  {getCurrentRoute().name}
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    {getCurrentRoute().description}
                  </span>
                </h2>
                <div className="space-y-3">
                  {getCurrentRoute().nodes.map((node, idx) => {
                    const isUnlocked = gameState.unlockedNodes.includes(node.id);
                    const canUnlock = idx === 0 || gameState.unlockedNodes.includes(getCurrentRoute().nodes[idx - 1].id);
                    const canAfford = gameState.energy >= node.cost;

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
                        onClick={() => canUnlock && canAfford && !isUnlocked && unlockNode(node.id)}
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
            )}
          </div>

          {/* Generators */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Generators</h2>
              <div className="space-y-2">
                {gameState.generators && gameState.generators.map((gen, idx) => {
                  const cost = gen.baseCost * Math.pow(1.15, gen.owned);
                  const canAfford = gameState.energy >= cost;
                  
                  // Check if unlocked via expansion route
                  let isLocked = false;
                  if (idx > 0) {
                    isLocked = true;
                    if (gameState.currentRoute === 'expansion' && gameState.unlockedNodes) {
                      const route = routes.expansion;
                      gameState.unlockedNodes.forEach(nodeId => {
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
                      onClick={() => !isLocked && buyGenerator(idx)}
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
          </div>
        </div>
      </div>

      {/* Route Selection Modal */}
      {showRouteSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-4 text-center">Choose Your Path</h2>
            <p className="text-gray-400 text-center mb-6">
              This choice will shape how your energy generation grows. Choose wisely!
            </p>
            <div className="grid gap-4">
              {Object.entries(routes).map(([key, route]) => (
                <button
                  key={key}
                  onClick={() => selectRoute(key)}
                  className="p-6 rounded-lg border-2 hover:border-opacity-100 border-opacity-50 transition-all text-left"
                  style={{ borderColor: route.color, backgroundColor: route.color + '20' }}
                >
                  <h3 className="text-2xl font-bold mb-2" style={{ color: route.color }}>
                    {route.name}
                  </h3>
                  <p className="text-gray-300">{route.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Respec Modal */}
      {showRespec && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Respec Route</h2>
            <p className="text-gray-300 mb-6">
              Reset your current route and recover 75% of spent energy. You'll be able to choose a new path.
            </p>
            <div className="flex gap-4">
              <button
                onClick={respecRoute}
                className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 rounded font-bold"
              >
                Confirm Respec
              </button>
              <button
                onClick={() => setShowRespec(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncrementalGame;