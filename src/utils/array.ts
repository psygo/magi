export {}

/**
 * Extra Utilities on `Array`
 */
declare global {
  interface Array<T> {
    first(): T
    second(): T
    penultimate(): T
    last(): T
  }
}

Array.prototype.first = function <T>(): T {
  return this.at(0)
}

Array.prototype.second = function <T>(): T {
  return this.at(1)
}

Array.prototype.penultimate = function <T>(): T {
  return this.at(-2)
}

Array.prototype.last = function <T>(): T {
  return this.at(-1)
}
