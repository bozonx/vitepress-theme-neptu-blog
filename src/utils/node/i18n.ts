import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import { standardTemplate } from '../shared/string.ts'
import { DEFAULT_ENCODE } from '../../constants.ts'

// File name (inside the locale folder) holding the per-locale site config.
export const LOCALE_SITE_FILE = '_site.yaml'
// File name (in srcDir root) holding the cross-locale shared site config.
export const SHARED_SITE_FILE = 'site.yaml'

export interface ParseLocaleSiteProps {
  localeIndex: string
  [key: string]: unknown
}

function parseYamlWithTemplate(
  absPath: string,
  props: Record<string, unknown>
): unknown {
  if (!fs.existsSync(absPath)) {
    return {}
  }

  try {
    const raw = fs.readFileSync(absPath, DEFAULT_ENCODE)
    const substituted = standardTemplate(raw, props)
    return yaml.parse(substituted) || {}
  } catch (error) {
    console.warn(
      `Failed to parse config file ${absPath}:`,
      (error as Error)?.message
    )
    return {}
  }
}

// Reads <srcDir>/<localeIndex>/_site.yaml (per-locale admin layer).
export function parseLocaleSite(
  srcDir: string,
  props: ParseLocaleSiteProps
): unknown {
  const absPath = path.join(srcDir, props.localeIndex, LOCALE_SITE_FILE)
  return parseYamlWithTemplate(absPath, props as Record<string, unknown>)
}

// Reads <srcDir>/site.yaml (cross-locale shared admin layer).
export function parseSharedSite(
  srcDir: string,
  props: Record<string, unknown>
): unknown {
  const absPath = path.join(srcDir, SHARED_SITE_FILE)
  return parseYamlWithTemplate(absPath, props)
}
