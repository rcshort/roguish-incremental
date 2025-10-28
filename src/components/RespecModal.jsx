import React from 'react';

const RespecModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Respec Route</h2>
        <p className="text-gray-300 mb-6">
          Reset your current route and recover 75% of spent energy. You'll be able to choose a new path.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 rounded font-bold"
          >
            Confirm Respec
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RespecModal;