export {}

export function stringIsEmpty(
  s: string | null | undefined,
) {
  return s === "" || s === null || s === undefined
}

/**
 * Extra Utilities on `string`
 */
declare global {
  interface String {
    first(): string
    second(): string
    penultimate(): string
    last(): string
  }
}

String.prototype.first = function (): string {
  return this.at(0) ?? ""
}

String.prototype.second = function (): string {
  return this.at(1) ?? ""
}

String.prototype.penultimate = function (): string {
  return this.at(-2) ?? ""
}

String.prototype.last = function (): string {
  return this.at(-1) ?? ""
}
