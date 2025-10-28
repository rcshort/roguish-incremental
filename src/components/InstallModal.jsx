import React, { useState, useEffect } from 'react';
import { Share, X } from 'lucide-react';

const InstallModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Show modal for iOS users who haven't installed yet
    const hasSeenPrompt = localStorage.getItem('hasSeenInstallPrompt');
    if (iOS && !standalone && !hasSeenPrompt) {
      setTimeout(() => setShowModal(true), 3000); // Show after 3 seconds
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    localStorage.setItem('hasSeenInstallPrompt', 'true');
  };

  if (!showModal || !isIOS || isStandalone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Install This App</h2>
        
        <p className="text-gray-300 mb-4">
          For the best experience, add this game to your home screen:
        </p>
        
        <ol className="space-y-3 text-gray-300 mb-6">
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-400">1.</span>
            <span>Tap the <Share size={16} className="inline mx-1" /> Share button at the bottom of Safari</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-400">2.</span>
            <span>Scroll down and tap "Add to Home Screen"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-400">3.</span>
            <span>Tap "Add" in the top right corner</span>
          </li>
        </ol>

        <button
          onClick={handleClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default InstallModal;