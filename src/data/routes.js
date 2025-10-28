export const routes = {
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

export const milestones = [
  { level: 0, threshold: 0, description: 'Game Start' },
  { level: 1, threshold: 50, description: 'First Route Choice' },
  { level: 2, threshold: 500, description: 'Route Node Unlock' },
  { level: 3, threshold: 2500, description: 'Route Node Unlock' },
  { level: 4, threshold: 12500, description: 'Route Node Unlock' }
];