# Locales Design

This document defines the locale model for the theme.

## Goals

- Keep the theme multilingual by design.
- Support both short and hyphenated locales such as `en`, `ru`, `en-US`, `en-GB`, `pt-BR`, `zh-CN`.
- Make interface language follow the content language: one locale axis.
- Prefer predictable behavior over implicit magic.
- Let blog admins add or partially override locale strings.

## Terms

### Locale

The theme has a single locale concept that controls both content and interface.

It is defined by the URL and the content folder:

```text
src/
  en/
  ru/
  en-US/
```

The theme always assumes locale-prefixed content routing. Even a single-language site stores content inside a locale folder such as `src/en/`.

When the user is on `/ru/post/hello`, the content tree, page language metadata, alternate locale links, and every interface string (buttons, menu labels, helper text) are taken from the same `ru` locale.

There is no separate "UI locale" stored in `localStorage` or controlled by a switcher in the topbar.

## Core rules

### 1. Locale comes from the URL

The current locale is resolved from the route.

Examples:

- `/en/post/hello` &rarr; locale `en`
- `/en-GB/post/hello` &rarr; locale `en-GB`
- `/ru/page/about` &rarr; locale `ru`

The URL is the source of truth.

### 2. Locale-prefixed routing is always on

The theme does not support disabling multilingual routing. Internal links are always resolved relative to the current locale.

## First visit behavior

When the user opens `/`, the site resolves the preferred locale and redirects to the locale home page.

Resolution order:

1. Browser language exact match against supported locales.
2. Browser language base match using the part before `-`.
3. Default locale configured by the site.

Examples:

- `navigator.language = en-GB`, supported locales include `en-GB` &rarr; redirect to `/en-GB/`
- `navigator.language = en-US`, supported locales include `en` but not `en-US` &rarr; redirect to `/en/`
- nothing matches &rarr; redirect to default locale

## Built-in locale defaults

The theme ships built-in translations for a small set of locales under `src/configs/blogLocalesBase/<locale>.ts`. Each file is a `LocaleDefinition` with `themeConfig` (UI labels such as `langMenuLabel`, `sidebarMenuLabel`) and `t` (translation strings).

Resolution rule for the built-in layer:

1. Exact key match against the current locale (e.g. `en-GB`).
2. Base-language match using the part before `-` (e.g. `en` for `en-GB`).
3. Built-in English fallback `en`.

This rule is implemented by `resolveBaseLocaleKey` and is the foundation of the merge stack described in [CONFIG_LAYERS.md](./CONFIG_LAYERS.md).

## Admin-defined locale strings

Admins add or override translation strings per locale in `src/<locale>/_site.yaml`:

```yaml
# src/ru/_site.yaml
themeConfig:
  langMenuLabel: 'Сменить язык'
  t:
    search: 'Поиск по блогу'
    links:
      donate: 'Поддержать'
```

Only the keys you list are overridden; the rest fall through to the built-in layer.

## Switching language

The language switcher in the topbar (`SwitchLang.vue`) switches the **content locale**: it navigates the user to the same page in another locale tree.

### Matching translated pages

The theme supports two ways to match translated versions of the same content page.

Priority:

1. Explicit `frontmatter.translations`.
2. Fallback to the same relative path in another locale.

#### 1. Explicit translations in frontmatter

When `translations` is present in frontmatter, it is the source of truth for matching translated pages.

```yaml
---
title: Hello world
translations:
  ru: /ru/post/privet-mir
  'en-US': /en-US/post/hello-world
  'pt-BR': /pt-BR/artigos/ola-mundo
---
```

This allows:

- different localized slugs
- different folder structure per locale
- explicit omission of some locales for a given page

#### 2. Relative-path fallback

If `frontmatter.translations` is not provided, the theme keeps the same relative path and replaces only the locale segment:

```text
en/post/hello-world.md
ru/post/hello-world.md
de/post/hello-world.md
```

This fallback assumes that translated pages use the same file name and the same folder structure in every locale tree. It does not support localized slugs with different file names.

## Formatting

Where browser locale formatting is needed, the theme uses the page `lang` tag, not the raw content folder key by assumption.

Examples:

- date formatting uses the resolved page `lang`
- SEO tags use the locale `lang` value where available
