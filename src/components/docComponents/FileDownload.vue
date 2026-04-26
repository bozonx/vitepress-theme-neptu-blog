<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import Btn from '../Btn.vue'
import { useData } from 'vitepress'

const { theme } = useData()

// Component props
const props = defineProps<{
  url: string
  filename?: string
  containerClass?: string
  disabled?: boolean
}>()

// Button disabled state
const isDisabled = computed(() => props.disabled)

// Computed filename for download (used in the download attribute)
const downloadFilename = computed(() => {
  if (props.filename) {
    return props.filename
  }

  // Extract full filename with extension from URL
  return props.url.split('/').pop() || 'file'
})

const extensionName = computed(() => {
  const filename = downloadFilename.value
  const extension = filename.split('.').pop()

  // If extension exists and differs from the filename itself (i.e., contains a dot)
  if (extension && extension !== filename) {
    return extension.toLowerCase()
  }

  return undefined
})

const downloadFile = async () => {
  if (isDisabled.value) return

  try {
    // Create a temporary link for downloading
    const link = document.createElement('a')
    link.href = props.url
    link.download = downloadFilename.value
    link.target = '_blank'

    // Append link to DOM, click it, then remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading file:', error)
    // On error, open the file in a new tab
    window.open(props.url, '_blank')
  }
}

// Resolve icon for file type
const getFileTypeIcon = (extension: string | undefined) => {
  // If extension is not defined, return the default icon
  if (!extension) {
    return 'mdi:file'
  }

  const iconMap: Record<string, string> = {
    pdf: 'mdi:file-pdf-box',
    doc: 'mdi:file-word-box',
    docx: 'mdi:file-word-box',
    xls: 'mdi:file-excel-box',
    xlsx: 'mdi:file-excel-box',
    ppt: 'mdi:file-powerpoint-box',
    pptx: 'mdi:file-powerpoint-box',
    txt: 'mdi:file-document-outline',
    zip: 'mdi:file-zip-box',
    rar: 'mdi:file-zip-box',
    '7z': 'mdi:file-zip-box',
    jpg: 'mdi:file-image',
    jpeg: 'mdi:file-image',
    png: 'mdi:file-image',
    webp: 'mdi:file-image',
    avif: 'mdi:file-image',
    gif: 'mdi:file-image',
    svg: 'mdi:file-image',
    mp4: 'mdi:file-video',
    avi: 'mdi:file-video',
    mov: 'mdi:file-video',
    mp3: 'mdi:file-music',
    wav: 'mdi:file-music',
    json: 'mdi:code-json',
    js: 'mdi:language-javascript',
    ts: 'mdi:language-typescript',
    html: 'mdi:language-html5',
    css: 'mdi:language-css3',
    xml: 'mdi:file-xml-box',
  }

  return iconMap[extension] || 'mdi:file'
}

// Icon to display
const fileIcon = computed(() => {
  return getFileTypeIcon(extensionName.value)
})
</script>

<template>
  <div
    class="file-download"
    :class="props.containerClass"
    role="region"
    :aria-label="`${theme.t.fileDownload.fileDownload}: ${downloadFilename}`"
  >
    <div class="file-info" :class="{ 'has-hint': $slots.default }">
      <div
        class="file-icon"
        :aria-label="`${theme.t.fileDownload.fileType}: ${extensionName || 'unknown'}`"
        role="img"
      >
        <Icon :icon="fileIcon" aria-hidden="true" />
      </div>
      <div class="file-details">
        <div
          class="file-name muted"
          :aria-label="`${theme.t.fileDownload.fileDownload}: ${downloadFilename}`"
        >
          {{ downloadFilename }}
        </div>
        <div v-if="$slots.default" class="file-hint">
          <slot />
        </div>
      </div>
    </div>

    <Btn
      icon="mdi:download"
      :disabled="isDisabled"
      :text="theme.t.fileDownload.downloadFile"
      class="download-btn"
      :aria-label="`${theme.t.fileDownload.downloadFileWithName} ${downloadFilename}`"
      role="button"
      tabindex="0"
      @click="downloadFile"
    />
  </div>
</template>

<style scoped>
.file-download {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  padding-left: 2rem;
  border: 1px solid var(--gray-150);
  border-radius: 0.75rem;
  background: #ffffff;
  transition: all 0.2s ease;
  gap: 1rem;
  border-left: 4px solid var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 0.325rem;
  margin-bottom: 0.325rem;
}

.dark .file-download {
  background: var(--gray-850);
  border-color: var(--gray-800);
  border-left-color: var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.file-info.has-hint {
  align-items: flex-start;
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--gray-100);
  border-radius: 0.375rem;
  color: var(--gray-600);
  flex-shrink: 0;
}

.dark .file-icon {
  background: var(--gray-800);
  color: var(--gray-400);
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  word-break: break-all;
  margin-bottom: 0.25rem;
}

.file-hint {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-style: italic;
  margin-top: 0.25rem;
}

.dark .file-hint {
  color: var(--gray-400);
}

.download-btn {
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .file-download {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.75rem;
    padding-left: 1.5rem;
  }

  .file-info {
    justify-content: flex-start;
    order: 1;
    width: 100%;
  }

  .download-btn {
    width: 100%;
    justify-content: center;
    order: 2;
  }
}
</style>
