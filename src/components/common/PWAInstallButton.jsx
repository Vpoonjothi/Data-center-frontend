import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallButton = () => {
  const [canInstall, setCanInstall] = useState(!!window.deferredPrompt);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  );

  useEffect(() => {
    const handlePromptReady = () => setCanInstall(true);
    const handleAppInstalled = () => setIsInstalled(true);
    
    window.addEventListener('pwa-prompt-ready', handlePromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaQueryChange = (e) => {
      if (e.matches) setIsInstalled(true);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    } else {
      mediaQuery.addListener(handleMediaQueryChange); // Fallback for older browsers
    }

    return () => {
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      } else {
        mediaQuery.removeListener(handleMediaQueryChange);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!window.deferredPrompt) {
      setShowManualModal(true);
      return;
    }
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      window.deferredPrompt = null;
      setCanInstall(false);
      setIsInstalled(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-10 right-10 z-[9999]"
        style={{ perspective: 1000 }}
      >
        <motion.button
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          onClick={handleInstallClick}
          className={`relative w-16 h-16 rounded-[1.25rem] group cursor-pointer shadow-[0_15px_35px_-10px_rgba(26,128,29,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(26,128,29,0.8)] transition-shadow duration-500 ${!canInstall ? 'opacity-80' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div 
            animate={{ rotateY: [0, 0, 180, 180, 0] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1], ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front Side: The Leaf App Icon */}
            <div 
              className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#0F4A11] via-[#1A801D] to-[#2EAA32] rounded-[1.25rem] border-t border-white/40 border-b border-black/30 flex items-center justify-center overflow-hidden" 
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Inner glass glare for 3D realism */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
              
              <svg className="w-8 h-8 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            
            {/* Back Side: Dark Neon Install CTA */}
            <div 
              className="absolute inset-0 w-full h-full bg-[#020817] rounded-[1.25rem] border border-secondary flex flex-col items-center justify-center [transform:rotateY(180deg)] overflow-hidden" 
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Glowing pulse on the back */}
              <div className="absolute inset-0 bg-secondary/30 animate-pulse rounded-[1.25rem]"></div>
              <svg className="w-5 h-5 text-[#2EAA32] mb-0.5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-white font-extrabold text-[10px] uppercase tracking-wider relative z-10">
                Install
              </span>
            </div>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Manual Installation Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowManualModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 border-b border-white/5 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Install App</h3>
                <p className="text-xs text-gray-400">Add to your Home Screen</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-300 leading-relaxed">
                To install the app on your device, follow these quick steps in your browser menu:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Tap the Menu Button</p>
                    <p className="text-xs text-gray-400 mt-1">Look for the three dots <strong className="text-white">⋮</strong> (Android) or the Share icon <strong className="text-white">↑</strong> (iOS) in your browser.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Select "Add to Home screen"</p>
                    <p className="text-xs text-gray-400 mt-1">Tap this option and follow the prompt to install.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowManualModal(false)}
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-colors mt-2 border border-white/5"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallButton;
