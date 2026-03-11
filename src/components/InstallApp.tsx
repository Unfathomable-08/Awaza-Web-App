"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaDownload } from "react-icons/fa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallApp() {
  const [isVisible, setIsVisible] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(true);

  // Handle PWA installation events
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Close notification and set cooldown
  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("notificationClosed", Date.now().toString());
  };

  // Trigger PWA install prompt
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      handleClose();
    } catch (error) {
      console.error("Error triggering install prompt:", error);
    }
  };

  if (!isInstallable || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed w-[80vw] sm:w-[60vw] px-4 py-3 bottom-20 left-1 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg flex items-center justify-between"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Get Awaza App</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="bg-white text-blue-600 font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleInstall}
              disabled={!deferredPrompt}
            >
              Install
            </button>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white p-1"
              aria-label="Close notification"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}





export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Handle install prompt events
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    };

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
    } catch (error) {
      console.error("Error triggering install prompt:", error);
    }
  };

  return (
    <button
      onClick={handleInstall}
      disabled={!isInstallable}
      className="flex items-center space-x-3 text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaDownload />
      <span>Install Awaza App</span>
    </button>
  );
}