import slug from 'slug'

export function transliterate(rawStr: string, lang?: string): string {
  if (lang === 'eo') {
    const charTable: Record<string, string> = {
      ĉ: 'cy',
      Ĉ: 'Cy',
      ĝ: 'gy',
      Ĝ: 'Gy',
      ĥ: 'x',
      Ĥ: 'X',
      ĵ: 'jy',
      Ĵ: 'Jy',
      ŝ: 'sy',
      Ŝ: 'Sy',
      ŭ: 'w',
      Ŭ: 'W',
    }

    return rawStr
      .split('')
      .map((el) => (charTable[el] ? charTable[el] : el))
      .join('')
  }

  return slug(rawStr, { locale: lang })
}
