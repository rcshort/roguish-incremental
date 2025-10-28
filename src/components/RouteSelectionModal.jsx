import React from 'react';
import { routes } from '../data/routes';

const RouteSelectionModal = ({ isOpen, onSelectRoute }) => {
  if (!isOpen) return null;

  return (
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
              onClick={() => onSelectRoute(key)}
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
  );
};

export default RouteSelectionModal;