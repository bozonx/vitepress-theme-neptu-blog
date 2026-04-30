# Locales Design

This document defines the target locale model for the theme.

## Goals

- Keep the theme multilingual by design.
- Support both short and hyphenated content locales such as `en`, `ru`, `en-US`, `en-GB`, `pt-BR`, `zh-CN`.
- Separate content language from interface language.
- Load only the required interface locale at runtime.
- Prefer predictable behavior over implicit magic.
- Let blog admins add or partially override interface locales.

## Terms

### Content locale

The content locale is the locale of the current route and content tree.

Examples:

- `en`
- `ru`
- `en-US`
- `en-GB`

It is defined by the URL and the content folder:

```text
src/
  en/
  ru/
  en-US/
```

The theme always assumes locale-prefixed content routing.

Even a single-language site still stores content inside a locale folder such as `src/en/`.

### UI locale

The UI locale is the locale used for theme interface strings such as:

- buttons
- menu labels
- search labels
- helper text

The UI locale may match the content locale, but it does not have to.

Examples:

- user reads `/ru/post/...` but wants the UI in `en`
- user reads `/en-GB/post/...` and wants the UI specifically in `en-GB`

## Core rules

### 1. Content locale comes from the URL

The current content locale is resolved from the route.

Examples:

- `/en/post/hello` -> content locale `en`
- `/en-GB/post/hello` -> content locale `en-GB`
- `/ru/page/about` -> content locale `ru`

We do not store a preferred content locale in `localStorage`.

The URL is the source of truth for content locale.

### 2. UI locale is separate from content locale

The interface language may differ from the content language.

The resolved UI locale affects only interface strings and related UI formatting.

The content locale still controls:

- which content tree is open
- page language metadata
- alternate locale links
- locale-specific content pages

### 3. Locale-prefixed routing is always on

The theme does not support disabling multilingual routing.

Internal links are always resolved relative to the current content locale.

## First visit behavior

### On `/`

When the user opens `/`, the site resolves the content locale and redirects to the locale home page.

Resolution order:

1. Browser language exact match against supported content locales.
2. Browser language base match using the part before `-`.
3. Default content locale configured by the site.

Examples:

- `navigator.language = en-GB`, supported locales include `en-GB` -> redirect to `/en-GB/`
- `navigator.language = en-US`, supported locales include `en` but not `en-US` -> redirect to `/en/`
- nothing matches -> redirect to default content locale

### On a direct entry page

If the user lands directly on a content page such as `/ru/post/hello` and there is no saved UI locale preference, the UI locale is resolved from the current page content locale.

This avoids mixed-language pages on first visit.

## UI locale resolution

The UI locale is resolved using this order:

1. Explicit user choice from the UI language switcher.
2. Saved UI locale in `localStorage`.
3. Exact match with the current content locale.
4. Base-language match using the part before `-`.
5. Default UI locale from config.
6. Built-in English fallback `en`.

Examples:

- content locale `en-GB`, UI locale `en-GB` exists -> use `en-GB`
- content locale `en-AU`, only UI locale `en` exists -> use `en`
- content locale `pt-BR`, no `pt-BR` UI locale, no `pt` UI locale -> use configured default UI locale

## Why no content-to-UI mapping table for now

We are intentionally not introducing an explicit content-to-UI mapping table in the first version.

Reason:

- exact-match + base-language fallback already covers the common cases
- it keeps the configuration smaller
- it matches the current simplicity goals of the theme

If future use cases require special routing such as `zh-TW -> zh-Hant`, a mapping layer can be added later.

## User preference storage

Only the preferred UI locale is stored.

Suggested storage key:

```text
neptu-ui-locale
```

Rules:

- if the user explicitly selects a UI locale, save it
- if the saved UI locale exists, use it even when the current content locale is different
- if the saved UI locale is no longer available, rerun normal UI locale resolution

## Switchers

### Topbar switcher

The language switcher in the topbar switches the UI locale only.

It does not change the current content route.

Behavior:

- updates the interface language
- persists the choice in `localStorage`
- keeps the user on the current content page

Example:

- user is on `/ru/post/hello`
- user selects UI locale `en`
- page stays `/ru/post/hello`
- interface becomes English

### "View in another language"

Content locale switching should be exposed separately.

Suggested placement:

- in the post meta block
- on the same line as the date
- aligned to the right side

Purpose:

- switch to another content locale version of the same page when available
- keep this action clearly separate from UI language switching

This control is conceptually different from the topbar UI switcher.

## Config shape

The implementation should stay close to standard VitePress locale configuration where possible.

Content locales continue to live in `locales`.

Example:

```ts
export default defineConfig({
  locales: {
    en: { lang: 'en-US' },
    'en-GB': { lang: 'en-GB' },
    ru: { lang: 'ru-RU' },
  },
  themeConfig: {
    uiLocale: {
      default: 'en',
      storageKey: 'neptu-ui-locale',
    },
    uiLocales: {
      en: {
        label: 'English',
        t: {
          currentLang: 'Current language',
        },
      },
      'en-GB': {
        extends: 'en',
        label: 'English (UK)',
        t: {
          currentLang: 'Current language',
        },
      },
      ru: {
        label: 'Русский',
        t: {
          currentLang: 'Текущий язык',
        },
      },
    },
  },
})
```

## Admin-defined UI locales

The blog admin must be able to:

- add a new UI locale not shipped by the theme
- partially override a built-in UI locale
- define a variant locale such as `en-GB`

### Partial override support

`themeConfig.uiLocales` should support partial extension.

Suggested behavior:

- if a locale defines `extends`, load the parent locale first
- deep-merge the child locale on top
- if `extends` is omitted but the locale key matches a built-in locale, merge on top of the built-in locale
- if neither applies, treat the locale as standalone

Examples:

```ts
uiLocales: {
  en: {
    t: {
      search: 'Find in blog',
    },
  },
  'en-GB': {
    extends: 'en',
    t: {
      links: {
        donate: 'Support',
      },
    },
  },
}
```

## Runtime loading

The theme should not eagerly load all UI locales.

Target behavior:

1. Resolve the required UI locale key.
2. Load only that locale.
3. If not available, try base-language fallback.
4. If still not available, load default UI locale.
5. If that fails, load built-in `en`.

### Built-in locales

Built-in theme locales should be loaded with dynamic import.

Examples:

- `import('./blogLocalesBase/en.ts')`
- `import('./blogLocalesBase/ru.ts')`

### Admin locales

Admin-defined locales come from user config and are already available as config objects.

They do not need dynamic import.

## Content locale support

The theme should fully support hyphenated content locales the same way it supports two-letter locales.

This applies to:

- route parsing
- link generation
- SEO locale metadata
- page-level alternate locale navigation
- interface locale fallback from content locale

Examples:

- `en-US` content is valid
- `en-GB` content is valid
- `pt-BR` content is valid

The theme does not impose a two-letter-only rule for content locale keys.

## Formatting

Where browser locale formatting is needed, the theme should use the page language tag, not the raw content folder key by assumption.

Examples:

- date formatting should use the resolved page `lang`
- SEO tags should use the locale `lang` value where available

## Open implementation tasks

- document example-site patterns for `/` redirect and custom `uiLocales`
- add tests for UI locale fallback and persistence

## Current status

Already implemented in the repo:

- locale-prefixed routing is always assumed
- content locale keys may be hyphenated
- UI fallback from `en-US` to `en` exists for built-in locale lookup
- date formatting uses page `lang` instead of assuming short locale keys
- runtime UI locale resolver with `localStorage` support
- lazy loading of built-in UI locales
- topbar switcher for UI locale selection
- separate post-level content locale switcher
- admin-defined `uiLocales` with partial override and `extends`
- initial SSR merge for content-derived UI locale and admin overrides

Not implemented yet:

- cross-page content-locale matching for translated pages beyond VitePress locale links
