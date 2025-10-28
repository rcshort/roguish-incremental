import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EnergyDisplay from './components/EnergyDisplay';
import Milestones from './components/Milestones';
import RouteMap from './components/RouteMap';
import GeneratorList from './components/GeneratorList';
import RouteSelectionModal from './components/RouteSelectionModal';
import RespecModal from './components/RespecModal';
import InstallModal from './components/InstallModal';
import { routes, milestones } from './data/routes';
import { generatorTypes } from './data/generatorTypes';

const App = () => {
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
        if (node) refund += node.cost * 0.75;
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

  const calculatePassiveRate = () => {
    return gameState.generators ? gameState.generators.reduce((sum, g) => sum + (g.owned * g.baseRate), 0) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <Header 
          currentRoute={gameState.currentRoute}
          onRespec={() => setShowRespec(true)}
          onReset={resetGame}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <EnergyDisplay
              energy={gameState.energy}
              totalEnergy={gameState.totalEnergy}
              clickPower={gameState.clickPower}
              passiveRate={calculatePassiveRate()}
              onClick={handleClick}
            />

            <Milestones milestoneLevel={gameState.milestoneLevel} />

            <RouteMap
              currentRoute={gameState.currentRoute}
              unlockedNodes={gameState.unlockedNodes}
              energy={gameState.energy}
              onUnlockNode={unlockNode}
            />
          </div>

          <div className="space-y-4">
            <GeneratorList
              generators={gameState.generators}
              energy={gameState.energy}
              currentRoute={gameState.currentRoute}
              unlockedNodes={gameState.unlockedNodes}
              onBuyGenerator={buyGenerator}
            />
          </div>
        </div>
      </div>

      <RouteSelectionModal
        isOpen={showRouteSelection}
        onSelectRoute={selectRoute}
      />

      <RespecModal
        isOpen={showRespec}
        onConfirm={respecRoute}
        onCancel={() => setShowRespec(false)}
      />

      <InstallModal />
    </div>
  );
};

export default App;