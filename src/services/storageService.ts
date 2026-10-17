/**
 * Safe local storage repository abstraction with error boundary,
 * schema fallback, and corrupted data recovery.
 */
export const storageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultValue;
      }
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
        console.warn(`[storageService] Key "${key}" expected array but got:`, parsed);
        return defaultValue;
      }
      return parsed as T;
    } catch (err) {
      console.error(`[storageService] Failed to parse key "${key}". Falling back to default:`, err);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[storageService] Failed to set key "${key}":`, err);
      return false;
    }
  },

  remove(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error(`[storageService] Failed to remove key "${key}":`, err);
    }
  },

  clearAll(prefix = 'ease_campus_'): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }
    } catch (err) {
      console.error('[storageService] Failed to clear keys:', err);
    }
  },
};
