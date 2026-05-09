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
  const fileName = `site.${props.localeIndex}.yaml`
  const absPath = path.join(srcDir, SITE_DIR_REL_PATH, fileName)

  if (!fs.existsSync(absPath)) {
    return {}
  }

  try {
    const raw = fs.readFileSync(absPath, DEFAULT_ENCODE)
    const substituted = standardTemplate(raw, props as Record<string, unknown>)
    return yaml.parse(substituted) || {}
  } catch (error) {
    console.warn(`Failed to parse config file ${fileName}:`, (error as Error)?.message)
    return {}
  }
}

export function loadConfigYamlFile(srcDir: string, fileName: string): unknown {
  const absPath = path.join(srcDir, SITE_DIR_REL_PATH, fileName)

  if (!fs.existsSync(absPath)) {
    return {}
  }

  try {
    const content = fs.readFileSync(absPath, DEFAULT_ENCODE)
    return yaml.parse(content) || {}
  } catch (error) {
    console.warn(`Failed to parse config file ${absPath}:`, (error as Error)?.message)
    return {}
  }
}
