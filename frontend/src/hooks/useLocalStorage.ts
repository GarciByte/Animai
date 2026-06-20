"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setStoredValue] = useState<T>(fallback);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error(
        `Error leyendo localStorage para la clave "${key}":`,
        error,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const resolved =
          newValue instanceof Function ? newValue(prev) : newValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch (error) {
          console.error(
            `Error guardando en localStorage la clave "${key}":`,
            error,
          );
        }
        return resolved;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key);
    setStoredValue(fallback);
  }, [key, fallback]);

  return { value, setValue, removeValue } as const;
}
