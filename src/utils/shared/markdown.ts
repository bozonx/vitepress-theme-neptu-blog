/** Remove H1 title from Markdown */
export function removeTitleFromMd(rawMd: string | null | undefined): string {
  if (!rawMd) return ''
  return rawMd.trim().replace(/^\#\s+.+/, '')
}
