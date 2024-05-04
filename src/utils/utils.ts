export function toInt(n: number | string) {
  return parseInt(n.toString())
}

export function toNumber(n: number | string) {
  return parseFloat(n.toString())
}

export function toPrecision(
  n: number | string,
  precision = 2,
) {
  return toNumber(toNumber(n).toFixed(precision))
}
