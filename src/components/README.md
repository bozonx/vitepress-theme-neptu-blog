# Компоненты темы Neptu Blog

В этой директории находятся Vue-компоненты, используемые в теме. Они разделены по функциональному назначению:

## Категории компонентов

-   **`layout-parts/`**: Части общего макета (SideBar, TopBar, Footer, LayoutAside и др.).
-   **`post/`**: Компоненты для отображения постов (PostAuthor, PostDate, PostTags, PostComments и др.).
-   **`utility/`**: Компоненты для служебных страниц (HomeHero, Authors, AllTagsList, Years и др.).
-   **`doc-components/`**: Компоненты для использования внутри markdown документов (FileDownload, AudioFile, YoutubeVideo).

## Основные компоненты

### Btn.vue и BtnLink.vue
Базовые компоненты кнопок и ссылок в стиле темы.

### PreviewListItem.vue
Основной компонент для отображения карточки поста в списках. Автоматически выбирает между `PreviewWithImage` и `PreviewNoImage`.

### Pagination.vue
Компонент пагинации для списков постов.

## Использование в Markdown

Вы можете использовать компоненты из `doc-components` прямо в своих `.md` файлах:

```html
<YoutubeVideo id="dQw4w9WgXcQ" title="Rick Astley" />
<FileDownload href="/files/manual.pdf" title="Скачать мануал" />
```

---
Документация обновлена после аудита именования.
