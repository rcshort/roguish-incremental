import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, Download } from 'lucide-react';

const Header = ({ currentRoute, onRespec, onReset }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Route Incremental</h1>
      <div className="flex gap-2">
        {showInstallButton && (
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2"
          >
            <Download size={16} />
            Install
          </button>
        )}
        {currentRoute && (
          <button
            onClick={onRespec}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Respec
          </button>
        )}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2"
        >
          <Settings size={16} />
          Reset
        </button>
      </div>
    </header>
  );
};

export default Header;