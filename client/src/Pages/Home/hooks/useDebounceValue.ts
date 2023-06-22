import { useEffect, useState } from "react";

export function useDebounceValue(state: string, debounceTimeout: number) {
  const [debounceValue, setDebounceValue] = useState(state);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(state);
    }, debounceTimeout);

    return () => {
      clearTimeout(timer);
    };
  }, [state, debounceTimeout]);

  return debounceValue;
}
