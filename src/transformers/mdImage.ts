import { getImageDimensions } from '../helpers/imageHelpers.js'

export interface MdImageOptions {
  srcDir?: string
}

/**
 * Плагин для обработки изображений в markdown. Автоматически оборачивает
 * изображения в теги <figure> с подписями. Аналогичен @mdit/plugin-figure.
 * Также собирает размеры изображений и добавляет их как атрибуты.
 */
export function mdImage(md: any, { srcDir }: MdImageOptions = {}): void {
  md.core.ruler.before('linkify', 'figure', (state: any) => {
    const tokens = state.tokens

    for (let i = 1; i < tokens.length - 1; i++) {
      const token = tokens[i]

      if (
        token.type === 'inline' &&
        token.children &&
        token.children.length > 0
      ) {
        const children = token.children
        const prevToken = tokens[i - 1]
        const nextToken = tokens[i + 1]

        const hasOnlyImage =
          (children.length === 1 && children[0].type === 'image') ||
          (children.length === 3 &&
            children[0].type === 'link_open' &&
            children[1].type === 'image' &&
            children[2].type === 'link_close')

        const isStandaloneParagraph =
          prevToken.type === 'paragraph_open' &&
          nextToken.type === 'paragraph_close'

        if (hasOnlyImage && isStandaloneParagraph) {
          const imageToken = children.length === 1 ? children[0] : children[1]

          const imageSrc = imageToken.attrGet('src')

          if (imageSrc && srcDir) {
            const dimensions = getImageDimensions(imageSrc, srcDir)

            if (dimensions) {
              imageToken.attrPush(['width', dimensions.width.toString()])
              imageToken.attrPush(['height', dimensions.height.toString()])
            }
          }

          if (children.length === 3) {
            const linkToken = children[0]
            linkToken.attrPush(['class', 'lightbox'])
          } else {
            const linkOpen = new state.Token('link_open', 'a', 1)
            linkOpen.attrPush(['href', imageSrc])
            linkOpen.attrPush(['class', 'lightbox'])

            const linkClose = new state.Token('link_close', 'a', -1)

            children.splice(0, 1, linkOpen, imageToken, linkClose)
          }

          prevToken.type = 'figure_open'
          prevToken.tag = 'figure'

          nextToken.type = 'figure_close'
          nextToken.tag = 'figure'

          const caption = imageToken.attrGet('alt') || imageToken.content

          if (caption) {
            const figcaptionOpen = new state.Token(
              'figcaption_open',
              'figcaption',
              1
            )

            const figcaptionText = new state.Token('text', '', 0)
            figcaptionText.content = caption

            const figcaptionClose = new state.Token(
              'figcaption_close',
              'figcaption',
              -1
            )

            children.push(figcaptionOpen, figcaptionText, figcaptionClose)
          }

          imageToken.attrPush(['tabindex', '0'])
        }
      }
    }
  })
}
