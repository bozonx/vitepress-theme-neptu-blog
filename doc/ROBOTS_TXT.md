# robots.txt

The theme automatically generates a `robots.txt` file during the build if you do **not** provide your own.

## Default behaviour

If there is **no** `robots.txt` in your `public/` folder, the theme creates one in the output directory with the following content:

```text
User-agent: *
Allow: /

Sitemap: https://<your-site-url>/sitemap.xml
```

The sitemap URL is taken from the `siteUrl` option in your VitePress config.

## Using a custom robots.txt

If you need custom rules (e.g. `Disallow: /admin`), place your own `robots.txt` inside `public/`:

```text
User-agent: *
Disallow: /admin
Allow: /

Sitemap: https://myblog.org/sitemap.xml
```

VitePress will copy it to the output directory automatically.

> **Important:** If you provide a custom `robots.txt`, the theme checks whether it contains a `Sitemap:` directive. If the directive is missing, a warning is printed during the build reminding you to add it.
