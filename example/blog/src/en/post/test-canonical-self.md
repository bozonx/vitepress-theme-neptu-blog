---
title: Test Canonical Self
description: "Testing canonical: 'self' parameter"
date: 2024-01-15
canonical: "self"
tags:
  - test
  - canonical
  - self
---

# Test Canonical Self

This post tests the `canonical: "self"` parameter.

## Self Reference

Using `canonical: "self"` should add a canonical link that points to the current page URL.

## Expected Result

The page should have a canonical link in the HTML head pointing to its own URL (e.g., `https://example.com/en/post/test-canonical-self`).

## Testing

1. Check the page source
2. Look for `<link rel="canonical" href="...">` in the head section
3. Verify the href points to the current page URL
4. Confirm that `canonical: "self"` generates a link to the page itself
