# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/theme.spec.ts >> Theme Appearance Switcher >> toggles dark mode class on html element
- Location: e2e/specs/theme.spec.ts:4:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/en/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Theme Appearance Switcher', () => {
  4  |   test('toggles dark mode class on html element', async ({ page }) => {
> 5  |     await page.goto('/en/')
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  6  | 
  7  |     const switchBtn = page.locator('button.VPSwitchAppearance').first()
  8  |     await expect(switchBtn).toBeVisible()
  9  | 
  10 |     const html = page.locator('html')
  11 |     const initialIsDark = await html.evaluate((el) => el.classList.contains('dark'))
  12 | 
  13 |     // Toggle theme
  14 |     await switchBtn.click()
  15 | 
  16 |     if (initialIsDark) {
  17 |       await expect(html).not.toHaveClass(/dark/)
  18 |     } else {
  19 |       await expect(html).toHaveClass(/dark/)
  20 |     }
  21 | 
  22 |     // Toggle back
  23 |     await switchBtn.click()
  24 | 
  25 |     if (initialIsDark) {
  26 |       await expect(html).toHaveClass(/dark/)
  27 |     } else {
  28 |       await expect(html).not.toHaveClass(/dark/)
  29 |     }
  30 |   })
  31 | })
  32 | 
```