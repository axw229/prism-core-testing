export default function isExplicitValue(value: unknown): boolean {
  return value !== null && typeof value !== 'undefined'
}
