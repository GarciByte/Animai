"use client";

import { useState, useCallback } from "react";

function readValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(`Error leyendo localStorage para la clave "${key}":`, error);
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, fallback: T) {
  // Lazy init: se ejecuta una sola vez en el cliente al montar.
  // Evita el warning "Avoid calling setState() directly within an effect",
  // ya que no hay ningún useEffect implicado.
  const [value, setStoredValue] = useState<T>(() => readValue(key, fallback));

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const resolved =
          newValue instanceof Function ? newValue(prev) : newValue;

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch (error) {
            console.error(
              `Error guardando en localStorage la clave "${key}":`,
              error,
            );
          }
        }

        return resolved;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    setStoredValue(fallback);
  }, [key, fallback]);

  return { value, setValue, removeValue } as const;
}
