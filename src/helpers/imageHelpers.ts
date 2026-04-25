import { imageSize } from 'image-size'
import fs from 'node:fs'
import path from 'node:path'

export interface ImageDimensions {
  width: number
  height: number
}

export interface ImageSizeResult extends ImageDimensions {
  type: string | undefined
}

/** Получает размеры изображения из файла */
export function getImageDimensions(
  imagePath: string | null | undefined,
  srcDir: string
): ImageDimensions | null {
  if (!imagePath) return null
  else if (imagePath.match(/\/\//)) return null

  try {
    // Полный путь к файлу изображения
    const fullImagePath = path.join(srcDir, 'public', imagePath)

    // Проверяем существование файла
    if (!fs.existsSync(fullImagePath)) {
      console.warn(`Image file not found: ${fullImagePath}`)
      return null
    }

    // Читаем файл в буфер и передаем буфер в getImageSize
    const buffer = fs.readFileSync(fullImagePath)

    // Проверяем, что буфер не пустой
    if (!buffer || buffer.length === 0) {
      console.warn(`Empty buffer for image file: ${fullImagePath}`)
      return null
    }

    const dimensions = getImageSize(buffer)

    // Проверяем, что размеры валидны
    if (!dimensions || !dimensions.width || !dimensions.height) {
      console.warn(`Invalid image dimensions for ${imagePath}`)
      return null
    }

    return { width: dimensions.width, height: dimensions.height }
  } catch (error) {
    console.warn(
      `Failed to get image dimensions for ${imagePath}:`,
      (error as Error)?.message
    )
    return null
  }
}

/** Получает размеры изображения из буфера */
export function getImageSize(buffer: Buffer): ImageSizeResult {
  try {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('Input must be a Buffer')
    }

    const dimensions = imageSize(buffer)

    return {
      width: dimensions.width,
      height: dimensions.height,
      type: dimensions.type,
    }
  } catch (error) {
    throw new Error(`Failed to get image dimensions: ${(error as Error)?.message}`)
  }
}
