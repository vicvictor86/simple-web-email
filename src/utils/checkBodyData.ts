export function hasAllAttributes(obj: any, keys: string[]): boolean {
  for (const key of keys) {
    if (!(key in obj)) {
      return false;
    }
  }
  return true;
}
