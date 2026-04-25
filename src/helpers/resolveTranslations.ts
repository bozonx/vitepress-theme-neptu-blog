import locales from '../configs/blogLocalesBase/index.ts'

type LocalesMap = Record<string, unknown>

export function resolveTranslationsByFilePath(filePath?: string): unknown {
  const map = locales as unknown as LocalesMap
  if (!filePath) return map.en

  const segments = filePath?.split('/').filter(Boolean) ?? []
  const localeIndex = segments[0] ?? ''

  if (!map[localeIndex]) return map.en

  return map[localeIndex]
}
