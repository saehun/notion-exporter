export function validateMeta(meta: Record<string, string>): void {
  if (
    meta.key?.length < 8 ||
    meta.target?.length < 2 ||
    typeof meta.stage !== 'string' ||
    typeof meta.Created !== 'string' ||
    typeof meta.category !== 'string' ||
    typeof meta.Published !== 'string'
  ) {
    throw new Error(`Invalid meta data:
 ${JSON.stringify(meta, undefined, 2)}`);
  }
}
