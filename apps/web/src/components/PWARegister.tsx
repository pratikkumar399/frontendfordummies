'use client';

import { useEffect, useRef } from 'react';

export function PWARegister() {
  const refreshingRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Ensure browser + Service Worker support
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let controllerChangeHandler: (() => void) | null = null;

    // Register the Service Worker
    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Periodically check for updates
        intervalRef.current = window.setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Activate waiting worker immediately if present
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Listen for newly installed workers
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener('statechange', () => {
            if (
              worker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              worker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      } catch (err) {
        console.error('Service Worker registration failed:', err);
      }
    };

    register();

    // Reload page once when new worker takes control
    controllerChangeHandler = () => {
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      controllerChangeHandler
    );

    // Cleanup listeners and timers on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (controllerChangeHandler) {
        navigator.serviceWorker.removeEventListener(
          'controllerchange',
          controllerChangeHandler
        );
      }
    };
  }, []);

  return null;
}
