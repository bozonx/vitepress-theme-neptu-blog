---
title: Test Canonical Short
description: "Testing canonical: 's' parameter (short version)"
date: 2024-01-15
canonical: "s"
tags:
  - test
  - canonical
  - short
---

# Test Canonical Short

This post tests the `canonical: "s"` parameter (short version of "self").

## Short Self Reference

Using `canonical: "s"` should work exactly the same as `canonical: "self"` and add a canonical link that points to the current page URL.

## Expected Result

The page should have a canonical link in the HTML head pointing to its own URL (e.g., `https://example.com/en/post/test-canonical-s`).

## Testing

1. Check the page source
2. Look for `<link rel="canonical" href="...">` in the head section
3. Verify the href points to the current page URL
4. Confirm that `canonical: "s"` generates a link to the page itself
5. Verify that `"s"` and `"self"` work identically
