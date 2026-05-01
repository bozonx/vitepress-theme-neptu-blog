# Build-Time Analytics

Build-time analytics integration for static VitePress sites. Statistics are fetched once during the build and baked into page data loaders.

## Why build-time

- **Fast** — no client-side requests to Google APIs.
- **Secure** — private credentials are used only on the build server and never ship to the browser.
- **Static** — fully static SSG output.
- **Cost-effective** — no risk of exceeding API quotas from traffic spikes.

## How it works

1. **At build time** (`pnpm run build`):
   - Reads environment variables.
   - Fetches view statistics from Google Analytics 4 (GA4).
   - Merges data into `post.analyticsStats` via VitePress data loaders.

2. **At runtime**:
   - Components consume the pre-baked `post.analyticsStats` for sorting and display.

## GA4 service account setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a **Service Account**.
3. Create a new **JSON** key for the account and download it.
4. Open the JSON and copy the `client_email` value.
5. Open your **Google Analytics 4** admin panel.
6. Add the copied email as a user with **Viewer** permissions.

### Environment variables

Never commit the JSON key to your repository. Use `.env` or CI/CD secrets:

```bash
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_JSON='{"type": "service_account", ...}'
```

### Blog config

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { defineBlogConfig } from 'vitepress-theme-neptu-blog/configs'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig(
  defineBlogConfig({
    themeConfig: {
      googleAnalytics: {
        propertyId: process.env.GA_PROPERTY_ID,
        credentialsJson: process.env.GA_CREDENTIALS_JSON,
        dataPeriodDays: 30,
      },
      popularPosts: {
        enabled: true,
        sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
      },
    },
  })
)
```

## Build logs

During build you will see:

```bash
🔍 Fetching GA stats for property 123456789...
✅ Loaded GA stats for 25 paths.
📈 Merged GA stats for 15 posts.
```

## Error handling

The system is failure-safe. If the network fails, the key is invalid, or GA returns an empty response, a warning is logged and **the build continues**. Posts are built without stats and popular-posts sorting falls back to date sorting.

## CI/CD example (GitHub Actions)

Add two secrets under **Settings -> Secrets and variables -> Actions**:
- `GA_PROPERTY_ID`
- `GA_CREDENTIALS_JSON`

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: pnpm install
      - name: Build
        env:
          GA_PROPERTY_ID: ${{ secrets.GA_PROPERTY_ID }}
          GA_CREDENTIALS_JSON: ${{ secrets.GA_CREDENTIALS_JSON }}
        run: pnpm run build
```
