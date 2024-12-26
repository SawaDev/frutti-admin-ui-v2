import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function useRouterState<T>(key: string, defaultValue: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (!paramValue) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, JSON.stringify(defaultValue));
      setSearchParams(newSearchParams);
    }
  }, [key, defaultValue, searchParams, setSearchParams]);

  const [state, setState] = useState<T>(() => {
    const paramValue = searchParams.get(key);
    return paramValue ? JSON.parse(paramValue) as T : defaultValue;
  });

  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (paramValue) {
      setState(JSON.parse(paramValue));
    }
  }, [searchParams, key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    setState((prevState) => {
      const newValue = value instanceof Function ? value(prevState) : value;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, JSON.stringify(newValue));
      setSearchParams(newSearchParams);
      return newValue;
    });
  };

  return [state, setValue] as const;
}