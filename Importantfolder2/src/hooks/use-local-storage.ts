'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * A hook that manages state in local storage and synchronizes it across tabs/iframes.
 * Uses BroadcastChannel for high-performance, high-capacity live syncing, 
 * falling back to localStorage for persistence with graceful quota handling.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Initialize BroadcastChannel for cross-tab/iframe sync (bypasses localStorage quota)
    const channel = new BroadcastChannel(`sync-${key}`);
    channelRef.current = channel;

    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        setStoredValue(event.data);
      }
    };

    channel.addEventListener('message', handleMessage);

    // Initial load from local storage for persistence across sessions
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading from local storage:", error);
    }

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [key]);

  // Fallback listener for changes from other windows (using standard storage event)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error("Error parsing storage change:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 1. Update local component state
      setStoredValue(valueToStore);
      
      // 2. Broadcast to other tabs/iframes immediately (no quota limit)
      if (channelRef.current) {
        channelRef.current.postMessage(valueToStore);
      }

      // 3. Persist to local storage (with quota handling)
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (storageError) {
          // Specifically handle QuotaExceededError (base64 images are often too big for 5MB limit)
          if (storageError instanceof DOMException && (
            storageError.name === 'QuotaExceededError' ||
            storageError.name === 'NS_ERROR_DOM_QUOTA_REACHED')
          ) {
            // Log a warning but don't crash. The BroadcastChannel above already synced the live view.
            console.warn("Local storage quota exceeded. The current session is synced live, but large media files may not persist after a browser restart.");
          } else {
            throw storageError;
          }
        }
      }
    } catch (error) {
      console.error("Error in useLocalStorage setValue:", error);
    }
  };

  return [storedValue, setValue];
}
