import { useState } from "react";
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    const newValue =
      typeof value === "function"
        ? (value as (prev: T) => T)(storedValue)
        : value;
    localStorage.setItem(key, JSON.stringify(newValue));
    setStoredValue(newValue);
  };
  const refresh = () => {
    const data = localStorage.getItem(key);
    setStoredValue(JSON.parse(data as string) as T);
  };
  return [storedValue, setValue, refresh] as const;
}
