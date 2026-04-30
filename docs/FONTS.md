# Customizing Fonts

By default, this theme uses standard system fonts to provide the fastest possible page load times and eliminate layout shifts (FOUT/FOIT). 

However, if you want to use custom fonts (like those from Google Fonts) to better match your brand or improve the design, the theme provides an easy way to override the defaults.

## How to add custom fonts

Adding custom fonts takes just two steps:

### 1. Load your font in the `<head>`

First, you need to tell VitePress to load the font from your provider (e.g., Google Fonts). Add the appropriate `<link>` tags to the `head` array in your `.vitepress/config.ts`:

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  // ...
  head: [
    // Preconnect for faster DNS resolution
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    
    // Load your desired fonts (e.g., Roboto for body, Fira Code for code)
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Fira+Code:wght@400;500&display=swap', rel: 'stylesheet' }]
  ],
  // ...
})
```

### 2. Override the CSS Variables

The theme defines CSS variables for its typography. To apply your new fonts, redefine these variables in your custom stylesheet (the one you import in `.vitepress/theme/index.ts`).

If your custom styles file is `.vitepress/theme/styles.css` (or wherever your Tailwind/custom CSS entrypoint is):

```css
/* .vitepress/theme/styles.css */
:root {
  /* This changes the main font used for body text, headings, buttons, etc. */
  --font-body: 'Roboto', ui-sans-serif, system-ui, sans-serif;
  
  /* This changes the monospace font used for code blocks and the audio player */
  --vp-font-family-mono: 'Fira Code', ui-monospace, monospace; 
}
```

By changing these variables, the custom fonts will automatically apply to all components across the entire theme. You do not need to write additional CSS rules to target specific elements.

### Recommended Approaches

- **Full custom font:** Use a custom font for both `--font-body` and `--vp-font-family-mono` to completely rebrand your site.
- **Headings only:** Leave `--font-body` as the default system font stack, but target headings manually in your `styles.css` if you want a custom font *only* for titles:
  ```css
  h1, h2, h3, h4, h5, h6, .vp-doc h1, .vp-doc h2 {
    font-family: 'Your Custom Heading Font', serif;
  }
  ```
  This is a great compromise that keeps the text readable and fast, while giving the page a unique style.
