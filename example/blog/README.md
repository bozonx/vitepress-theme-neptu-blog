# Blog

This example uses the theme in its intended locale-first form:

- content lives under `src/en/`
- `/` redirects to a content locale home page
- the topbar language switcher changes the UI locale only
- the post page switcher changes the content locale only when alternate content exists
- UI locales can exist without matching content trees

The example config includes:

- built-in English UI
- built-in Russian UI
- an admin-defined `en-GB` UI locale that partially extends `en`

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
