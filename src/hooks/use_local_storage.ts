export function useLocalStorage(key: string) {
  function get() {
    return localStorage.getItem(key) === "true"
  }

  function set(v: boolean) {
    localStorage.setItem(key, v.toString())
  }

  return { get, set }
}
