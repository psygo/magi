import { useEffect } from "react"

export function useLocalStorage<T = boolean>(
  key: string,
  startingValue?: T,
) {
  useEffect(() => {
    if (startingValue) set(startingValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function get() {
    return JSON.parse(localStorage.getItem(key)!) as T
  }

  function set(v: T) {
    localStorage.setItem(key, JSON.stringify(v))
  }

  return { get, set }
}
