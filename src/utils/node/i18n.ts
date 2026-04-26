import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import { standardTemplate } from '../shared/string.ts'
import { DEFAULT_ENCODE } from '../../constants.ts'

export const SITE_DIR_REL_PATH = 'site'

export interface ParseLocaleSiteProps {
  localeIndex: string
  [key: string]: unknown
}

export function parseLocaleSite(srcDir: string, props: ParseLocaleSiteProps): unknown {
  const translations = loadConfigYamlFile(
    srcDir,
    `site.${props.localeIndex}.yaml`
  )

  function transRecursive(items: unknown): unknown {
    if (Array.isArray(items)) {
      for (const index in items) {
        items[index] = transRecursive(items[index])
      }

      return items
    } else if (items && typeof items === 'object') {
      const obj = items as Record<string, unknown>
      for (const index of Object.keys(obj)) {
        obj[index] = transRecursive(obj[index])
      }

      return obj
    } else if (typeof items === 'string') {
      return standardTemplate(items, props as Record<string, unknown>)
    }

    return items
  }

  return transRecursive(translations)
}

export function loadConfigYamlFile(srcDir: string, fileName: string): unknown {
  const absPath = path.join(srcDir, SITE_DIR_REL_PATH, fileName)

  if (!fs.existsSync(absPath)) {
    return {}
  }

  try {
    const content = fs.readFileSync(absPath, DEFAULT_ENCODE)
    const obj = yaml.parse(content)

    if (obj && typeof obj === 'object' && 'body' in obj && typeof obj.body === 'string') {
      return yaml.parse(obj.body)
    }

    return obj || {}
  } catch (error) {
    console.warn(`Failed to parse config file ${absPath}:`, (error as Error)?.message)
    return {}
  }
}
