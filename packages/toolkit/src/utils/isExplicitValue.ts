export default function isExplicitValue(value: any): boolean {
  return value !== null && typeof value !== 'undefined'
}
