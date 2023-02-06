export default function isSomething(value: unknown): boolean {
  return value !== null && typeof value !== 'undefined'
}
