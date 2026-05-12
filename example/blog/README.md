# Blog

This example uses the theme in its intended locale-first form:

- content lives under `src/en/`
- `/` redirects to a content locale home page
- the topbar language switcher navigates to the same page in another content locale
- translations are matched via `frontmatter.translations` or same-relative-path fallback

The example config includes:

- built-in English locale defaults (labels, translations, social shares)
- built-in Russian locale defaults
- per-locale overrides via `src/<locale>/_site.yaml`

## Run

Use node version: 18 or greater

- Install dependencies:

  ```bash
  yarn
  ```

- Run locally:

  ```bash
  yarn dev
  ```

  Go to `http://localhost:5173/`

- Build and Preview

  ```bash
  yarn build && yarn preview
  ```

  Go to `http://localhost:4173/`

  Local admin panel is on `http://localhost:4173/admin/`
