---
title: Post with External Images
date: 2024-05-20
authorId: ivan-k
cover: https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop
tags:
  - images
  - test
---

This post demonstrates how to use external images from the internet.

## Cover Image
The cover image for this post is loaded from Unsplash using a full URL in the frontmatter.

## Content Images
Below are two images loaded from external sources.

![A beautiful landscape](https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop)

You can also use images with captions by placing them on their own line:

![A cozy cabin in the woods](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop)

Both of these images are external and the theme will handle them correctly, although it won't be able to pre-calculate their dimensions for the `width` and `height` attributes.
