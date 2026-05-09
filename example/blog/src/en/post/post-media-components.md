---
title: Media Components — YouTube, Video, Audio, File Download
description: >
  The theme ships four auto-registered components you can use directly in
  markdown: YoutubeVideo, VideoFile, AudioFile, and FileDownload.
date: 2025-02-10T10:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 675
coverAlt: Audio equipment and mixing board
tags:
  - media
  - components
  - video
  - audio
descrAsPreview: true
---

Four components are registered globally by the theme and can be used in any
markdown file without any imports.

## YoutubeVideo

Embeds a YouTube video with a responsive 16:9 container. Pass the video ID
(the part after `?v=` in the URL).

<YoutubeVideo id="dQw4w9WgXcQ" />

## VideoFile

Displays an inline player for local video files (MP4, WebM, OGG). Clicking play
reveals the native browser video player with full controls — seek, volume,
fullscreen, picture-in-picture.

<VideoFile
  url="/media/sample-video.mp4"
  filename="Big Buck Bunny — sample video (MP4)"
/>

## AudioFile

Displays an inline audio player with a download link. Provide a publicly
accessible URL to the audio file.

<AudioFile
  url="https://www.w3schools.com/html/horse.mp3"
  filename="Sample audio (horse.mp3)"
/>

## FileDownload

Renders a styled download button for any file.

<FileDownload
  url="https://www.w3.org/WAI/WCAG21/wcag21.pdf"
  filename="WCAG 2.1 PDF"
/>

## Using components together

You can mix and match all four in a single post. For example, a tutorial post
might have a `<VideoFile>` for a local screencast, a `<YoutubeVideo>` for a
related talk, an `<AudioFile>` for the podcast version, and a `<FileDownload>`
for the source code archive.
