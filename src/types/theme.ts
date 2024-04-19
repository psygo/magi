export enum Theme {
  light = "light",
  dark = "dark",
}

export function stringToTheme(s: string) {
  return Object.values(Theme).find(
    (t) => t.toString() === s,
  )!
}
