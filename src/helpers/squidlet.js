/**
 * This file contains utility functions extracted to remove external dependencies.
 */

/**
 * Split deep path to paths E.g "aa[0].bb[1].cc" => ['aa', 0, 'bb', 1, 'cc']
 */
export function splitDeepPath(pathTo) {
  if (!pathTo || typeof pathTo !== 'string') return []

  const res = []
  const DEEP_PATH_SEPARATOR = '.'
  const preparedPath = pathTo.replace(/\[/g, DEEP_PATH_SEPARATOR + '[')
  const splatDots = preparedPath.startsWith(DEEP_PATH_SEPARATOR) 
    ? preparedPath.slice(1).split(DEEP_PATH_SEPARATOR)
    : preparedPath.split(DEEP_PATH_SEPARATOR)

  for (const el of splatDots) {
    if (el.indexOf('[') === 0) {
      const match = el.match(/^\[(-?\d+)\]$/)
      if (match && match[1]) {
        const index = Number(match[1])
        if (index >= 0) {
          res.push(index)
        } else {
          res.push('__NEGATIVE_INDEX__')
        }
      } else {
        return []
      }
    } else {
      res.push(el)
    }
  }

  return res
}

/**
 * Join deep path parts to string E.g ['aa', 0, 'bb', 1, 'cc'] => "aa[0].bb[1].cc"
 */
export function joinDeepPath(pathParts) {
  if (!Array.isArray(pathParts) || !pathParts.length) return ''

  let result = ''
  const DEEP_PATH_SEPARATOR = '.'

  for (const item of pathParts) {
    if (typeof item === 'number') {
      result += `[${item}]`
    } else if (typeof item === 'string' && item) {
      result += DEEP_PATH_SEPARATOR + item
    }
  }

  return result.startsWith(DEEP_PATH_SEPARATOR) ? result.slice(1) : result
}

/**
 * Check if path is valid (can be parsed correctly)
 */
export function isPathValid(pathTo) {
  if (!pathTo || typeof pathTo !== 'string') return false
  const splatPath = splitDeepPath(pathTo)
  return splatPath.length > 0
}

/**
 * Get value deeply from object or array.
 */
export function deepGet(src, pathTo, defaultValue) {
  if (src === null || src === undefined) return defaultValue
  if (typeof pathTo !== 'string') return defaultValue

  const splatPath = splitDeepPath(pathTo)
  if (splatPath.length === 0) return defaultValue

  const firstKey = splatPath[0]
  const restPath = joinDeepPath(splatPath.slice(1))

  if (Array.isArray(src)) {
    if (typeof firstKey !== 'number' || firstKey === '__NEGATIVE_INDEX__') return defaultValue
    
    const value = src[firstKey]
    if (restPath) {
      return deepGet(value, restPath, defaultValue)
    }
    return typeof value !== 'undefined' ? value : defaultValue
  } else if (src && typeof src === 'object') {
    if (typeof firstKey !== 'string') return defaultValue

    const value = src[firstKey]
    if (restPath) {
      return deepGet(value, restPath, defaultValue)
    }
    return Object.prototype.hasOwnProperty.call(src, firstKey) ? value : defaultValue
  }
  
  return defaultValue
}

/**
 * Safe eval for template expressions
 */
function safeEval(expression, data) {
  try {
    const trimmedExpr = expression.trim()
    if (!trimmedExpr) return ''

    const context = { ...data }
    const paramNames = Object.keys(context)
    const paramValues = Object.values(context)

    const func = new Function(...paramNames, `return (${trimmedExpr});`)
    const result = func(...paramValues)

    return result === null || result === undefined ? '' : result
  } catch (error) {
    return ''
  }
}

/**
 * Mustache templates {{value.child}}
 */
export function mustacheTemplate(tmpl, data, options = { eval: false }) {
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const mustacheRegex = /\{\{([^}]*)\}\}/g
  let match

  while ((match = mustacheRegex.exec(tmpl)) !== null) {
    const originalKey = match[1]
    const key = originalKey.trim()
    const escapedKey = originalKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g')

    let stringValue
    if (options.eval) {
      if (!key) {
        stringValue = ''
      } else {
        const result = safeEval(key, data)
        stringValue = result === null || result === undefined ? '' : String(result)
      }
    } else {
      if (!isPathValid(key)) {
        stringValue = match[0]
      } else {
        const value = deepGet(data, key)
        stringValue = value === null || value === undefined ? '' : String(value)
      }
    }
    res = res.replace(replaceRegex, stringValue)
  }
  return res
}

/**
 * Standard templates ${value.child}
 */
export function standardTemplate(tmpl, data, options = { eval: false }) {
  if (tmpl === null || tmpl === undefined) return ''
  if (data === null || data === undefined) return tmpl

  let res = tmpl
  const templateRegex = /\$\{([^}]*)\}/g
  let match

  while ((match = templateRegex.exec(tmpl)) !== null) {
    const key = match[1]
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replaceRegex = new RegExp(`\\$\\{${escapedKey}\\}`, 'g')

    let stringValue
    if (options.eval) {
      if (!key.trim()) {
        stringValue = ''
      } else {
        const result = safeEval(key, data)
        stringValue = result === null || result === undefined ? '' : String(result)
      }
    } else {
      if (!isPathValid(key)) {
        stringValue = match[0]
      } else {
        const value = deepGet(data, key)
        stringValue = value === null || value === undefined ? '' : String(value)
      }
    }
    res = res.replace(replaceRegex, stringValue)
  }
  return res
}

/**
 * Omit undefined values from object
 */
export function omitUndefined(obj) {
  if (!obj || Array.isArray(obj) || typeof obj !== 'object') return {}

  const result = {}
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] !== 'undefined') {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Smart truncate string
 */
export function smartTruncate(rawString, length, options = {}) {
  const {
    mark = '\u2026',
    position = length - 1,
    respectWords = false,
    removeReturns = true,
    markAtTheEnd = true,
  } = options

  if (typeof mark !== 'string' || typeof rawString !== 'string' || length <= 4)
    return rawString

  let str = rawString
  if (removeReturns) {
    str = str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  } else {
    str = str.replace(/[ \t]+/g, ' ').trim()
  }

  if (str.length < 4 || length >= str.length) return str
  if (!markAtTheEnd) return str.substring(0, length)

  if (respectWords) {
    if (str.length <= length) return str
    const maxTextLength = length - mark.length
    if (maxTextLength <= 0) return mark
    const truncated = str.substring(0, maxTextLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + mark
    }
    return truncated + mark
  }

  if (position >= str.length || position >= length - mark.length) {
    return str.substring(0, length - mark.length) + mark
  }

  const start = str.substring(0, position)
  const end = str.slice(position + mark.length - length)
  return `${start}${mark}${end}`
}

/**
 * Remove H1 title from Markdown
 */
export function removeTitleFromMd(rawMd) {
  if (!rawMd) return ''
  return rawMd.trim().replace(/^\#\s+.+/, '')
}

/**
 * Trim extension from filename
 */
export function pathTrimExt(fileName) {
  if (typeof fileName !== 'string' || fileName.indexOf('.') < 0) return fileName
  const splat = fileName.split('.')
  splat.pop()
  return splat.join('.')
}

/**
 * Get intersection of two arrays
 */
export function arraysIntersection(arr1 = [], arr2 = []) {
  return arr1.filter((x) => arr2.includes(x))
}
