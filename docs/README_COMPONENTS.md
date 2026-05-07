# Components

The theme components are organized by purpose.

## Categories

- **`layout-parts/`** — layout pieces (SideBar, TopBar, Footer, LayoutAside).
- **`post/`** — post display components (PostAuthor, PostDate, PostTags, PostComments).
- **`utility/`** — utility page components (HomeHero, Authors, AllTagsList, Years).
- **`doc-components/`** — components you can use directly inside markdown (AudioFile, FileDownload, YoutubeVideo).

## Layout components

| Component | Description |
|-----------|-------------|
| `HomeHero` | Hero banner for the home page |
| `AllTagsList` | Full tag cloud |
| `NeptuAuthors` | Authors list page |
| `NeptuYears` | Archive by year |
| `PopularPostsList` | Popular posts widget |
| `RecentList` | Recent posts widget |
| `TagPostsList` | Posts filtered by tag |
| `MonthPostsList` | Posts filtered by month |
| `PageFindSearch` | Pagefind search integration |
| `Pagination` | List pagination |

## Doc components

These are registered globally and can be used in any `.md` file.

### AudioFile

```vue
<AudioFile
  url="/audio/sample.mp3"
  filename="Sample Audio.mp3"
  autoplay
  :show-controls="true"
/>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | required | Audio file URL |
| `filename` | `string` | `''` | Download file name |
| `class` | `string` | `''` | CSS classes |
| `disabled` | `boolean` | `false` | Disable player |
| `autoplay` | `boolean` | `false` | Autoplay on load |
| `showControls` | `boolean` | `true` | Show player controls |

**Slots**

| Slot | Description |
|------|-------------|
| `default` | Custom audio description |

Supported formats: MP3, WAV, OGG, FLAC, AAC, M4A, WMA.

### FileDownload

```vue
<FileDownload
  url="/files/manual.pdf"
  filename="manual.pdf"
  type="PDF"
  button-text="Download Manual"
/>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | required | File URL |
| `filename` | `string` | `''` | Download file name |
| `type` | `string` | `''` | File type label (e.g. `PDF`) |
| `buttonText` | `string` | `'Download'` | Button text |
| `class` | `string` | `''` | CSS classes |
| `disabled` | `boolean` | `false` | Disable button |

**Slots**

| Slot | Description |
|------|-------------|
| `default` | Custom file name display (supports HTML) |

Auto-detected icons for: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, ZIP/RAR/7Z, images, video, audio, JSON, JS, TS, HTML, CSS, XML.

### YoutubeVideo

See the dedicated package: [vitepress-youtube-embed](https://github.com/miletorix/vitepress-youtube-embed)

```vue
<YoutubeVideo id="dQw4w9WgXcQ" />
```
