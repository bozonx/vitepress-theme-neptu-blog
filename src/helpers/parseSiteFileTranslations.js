import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import { standardTemplate } from './squidlet.js'

import { DEFAULT_ENCODE } from '../constants.js'

export const SITE_DIR_REL_PATH = 'site'

export function parseLocaleSite(srcDir, props) {
  const translations = loadConfigYamlFile(
    srcDir,
    `site.${props.localeIndex}.yaml`
  )

  function transRecursive(items) {
    if (Array.isArray(items)) {
      for (const index in items) {
        items[index] = transRecursive(items[index])
      }

      return items
    } else if (typeof items === 'object') {
      for (const index of Object.keys(items)) {
        items[index] = transRecursive(items[index])
      }

      return items
    } else if (typeof items === 'string') {
      return standardTemplate(items, props)
    }

    return items
  }

  return transRecursive(translations)
}

export function loadConfigYamlFile(srcDir, fileName) {
  const absPath = path.join(srcDir, SITE_DIR_REL_PATH, fileName)
  const content = fs.readFileSync(absPath, DEFAULT_ENCODE)
  const obj = yaml.parse(content)

  return yaml.parse(obj.body)
}
