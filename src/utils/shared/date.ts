export function makeHumanDate(
  rawDate: string | number | Date | null | undefined,
  lang?: string,
  toTimeZone: string = 'UTC'
): string | undefined {
  if (!rawDate) return

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: toTimeZone,
  }

  return new Date(rawDate).toLocaleDateString(lang, options)
}
