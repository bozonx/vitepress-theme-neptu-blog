# Config Layers

This document describes the layered configuration system and how the theme merges settings from multiple sources.

## Overview

The theme uses a **stack of config layers** rather than a single monolithic file. Each layer is owned by a different persona and has a clear priority:

- **Developer** owns the VitePress config (`.vitepress/config.ts`).
- **Admin / content editor** owns YAML files inside `src/`.

## Merge order (low to high)

When the theme builds a locale it merges layers in this exact order. A higher layer can override anything from a lower layer.

```text
1. blogCommon.themeConfig       (theme defaults)
2. .vitepress/config.ts          (developer overrides)
3. src/site.yaml                 (cross-locale admin layer)
4. built-in UI locale            (theme-provided translations)
5. uiLocales[*]                  (custom UI locale packs)
6. src/<locale>/_site.yaml       (per-locale admin layer)
```

Arrays are **replaced by default**. The only exception is `authors`: entries are merged by `id`, where a child locale can override a parent author and new authors are appended.

## What goes where

The merge engine accepts any field in any layer, but the **example project enforces a convention** to keep responsibilities clear. Mixing roles still works, but you lose the benefit of a clean developer/admin split.

### `.vitepress/config.ts` — developer-only

Code-bound or environment-driven settings that an admin should not edit:

- VitePress core: `srcDir`, `siteUrl`, `vite`, `head`, `transformPageData`, `transformHead`, `buildEnd`
- Integrations with secrets or env vars: `themeConfig.popularPosts` (GA4 credentials), analytics scripts in `head`
- Search provider wiring: `themeConfig.search`
- Identifiers consumed by other layers: `themeConfig.repo` (referenced from YAML via `${theme.repo}`)
- Technical extension points: `themeConfig.uiLocale`, `themeConfig.uiLocales`
- Derived values that need code: anything computed from `process.env`, paths, or runtime conditions

### `src/site.yaml` — admin, all locales

Cross-locale presentation that the content team owns:

- Branding: `sidebarLogoSrc`, `sidebarLogoHeight`, `sidebarMenuLabel`
- Layout knobs: `sidebarTagsCount`, `similarPostsCount`, `paginationMaxItems`, `homeBgParallaxOffset`, `externalLinkIcon`, `perPage`
- Feature blocks: `sidebar`, `nav`, `footer`, `donate`, `publisher`, `authors`, `socialMediaShares`, `postList`, `postFooter`, `editLink`, `feeds`
- SEO toggles: `seo`, `autoCanonical`, `twitterSite`
- Routing: `tagsBaseUrl`, `archiveBaseUrl`, `popularBaseUrl`, `recentBaseUrl`, `authorsBaseUrl`
- Icon overrides: `donateIcon`, `recentIcon`, `popularIcon`, `byDateIcon`, `authorsIcon`, `rssIcon`, `atomIcon`, `youtubeIcon`, `tagsIcon`

### `src/<locale>/_site.yaml` — admin, per locale

Locale identity and locale-specific overrides of any of the fields above:

- Top-level: `lang`, `title`, `titleTemplate`, `description`
- Translations: `themeConfig.t`
- Locale-specific `nav`, `footer`, `sidebar.bottomLinks`, `socialMediaShares`, etc.

### Rule of thumb

If a value depends on **code, env vars, or secrets** → `config.ts`. Otherwise → YAML. When in doubt, prefer YAML: the layered model lets `config.ts` still override at any time without touching this rule.

## File reference

| File | Owner | Purpose |
|------|-------|---------|
| `.vitepress/config.ts` | Developer | VitePress entry config. Uses `defineBlogConfig` and `autoLoadLocales`. |
| `src/site.yaml` | Admin | Shared settings for all locales (nav, footer, social shares, etc.). |
| `src/<locale>/_site.yaml` | Admin | Per-locale overrides and locale-specific metadata. |
| `src/<locale>/_authors.yaml` | Admin | Per-locale author list. Merged into `themeConfig.authors` by `id`. |

## Dual format support

Every admin file supports both **TypeScript** and **YAML** with the same base name:

- `site.yaml`  ↔  `site.ts`
- `_site.yaml`  ↔  `_site.ts`
- `_authors.yaml`  ↔  `_authors.ts`

TypeScript takes precedence. If a `.ts` file exists the `.yaml` file is ignored. This lets developers opt into type-safe config authoring while admins can still edit YAML.

### TypeScript helpers

Import helpers from `vitepress-theme-neptu-blog/configs` to get autocomplete:

```ts
// site.ts
import { defineSiteConfig } from 'vitepress-theme-neptu-blog/configs'
export default defineSiteConfig({
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }],
  },
})
```

```ts
// src/en/_site.ts
import { defineLocaleConfig } from 'vitepress-theme-neptu-blog/configs'
export default defineLocaleConfig({
  lang: 'en',
  title: 'My Blog',
  themeConfig: {
    footer: { message: 'Built with VitePress' },
  },
})
```

```ts
// src/en/_authors.ts
import { defineAuthorsList } from 'vitepress-theme-neptu-blog/configs'
export default defineAuthorsList([
  { id: 'alice', name: 'Alice', link: [{ title: 'GitHub', url: 'https://github.com/alice' }] },
])
```

## Auto-discovery of locales

Instead of manually listing every locale in `.vitepress/config.ts`, use `autoLoadLocales`:

```ts
import { defineBlogConfig, autoLoadLocales } from 'vitepress-theme-neptu-blog/configs'

export default defineBlogConfig({
  // ... other settings
  ...autoLoadLocales('src'),
})
```

The function scans `srcDir` for folders that contain `_site.yaml` or `_site.ts` and registers each one as a VitePress locale automatically.

## Recursive `extends` in `_site.yaml`

A per-locale config can inherit from another locale with `extends`:

```yaml
# src/en-US/_site.yaml
extends: ../en/_site.yaml

themeConfig:
  nav:
    - text: Home
      link: /
```

The parent file is loaded first, then the child overrides it. Cycles are detected and reported as an error.

## Authors merge strategy

Authors are loaded from two sources and merged by `id`:

1. `themeConfig.authors` inside `_site.yaml`
2. `_authors.yaml` (or `_authors.ts`) in the same locale folder

If both files define an author with the same `id`, the **standalone file wins**. New authors from the standalone file are appended to the list.

## Validation

Admin-edited YAML is validated with Zod schemas. Invalid fields produce **warnings** in the console but do not crash the build. This lets admins iterate quickly while still catching typos.

Schemas live in `src/configs/siteSchema.ts`.

## Editor support

YAML files include a schema reference header for editors that support `yaml-language-server`:

```yaml
# yaml-language-server: $schema=../../schema/site.schema.json
```

This provides autocompletion and inline validation when editing `site.yaml` or `_site.yaml` in VS Code with the YAML extension.

JSON Schema files are located in `schema/site.schema.json` and `schema/authors.schema.json`.

## Hot reload for admin files

During development, changes to `site.yaml`, `_site.yaml`, or `_authors.yaml` automatically restart the VitePress dev server so edits appear immediately.

Enable it by adding the plugin to `.vitepress/config.ts`:

```ts
import { createSiteYamlHotReloadPlugin } from 'vitepress-theme-neptu-blog/configs'

export default defineBlogConfig({
  vite: {
    plugins: [
      createSiteYamlHotReloadPlugin('/absolute/path/to/src'),
    ],
  },
})
```

The plugin watches all `.yaml` and `.ts` variants of the config files and triggers a server restart on change.

## YAML shape rules

- Top-level keys in admin files are limited to: `lang`, `title`, `titleTemplate`, `description`, `extends`.
- Everything theme-related lives under `themeConfig:`.
- No top-level shorthand for `nav`, `sidebar`, `footer`, `donate`, `publisher`, `authors`, `socialMediaShares`, or `t`.

Example minimal `_site.yaml`:

```yaml
# yaml-language-server: $schema=../../schema/site.schema.json
lang: en
title: My Blog
description: Thoughts on engineering

themeConfig:
  nav:
    - text: Posts
      link: /posts/
  footer:
    message: Built with VitePress
```
