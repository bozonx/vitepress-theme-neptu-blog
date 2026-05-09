<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import NeptuBtn from '../NeptuBtn.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { theme } = useUiTheme()

const props = defineProps({
  url: { type: String, required: true },
  filename: { type: String, default: '' },
  containerClass: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const isDisabled = ref(props.disabled)

const downloadFilename = computed(() => {
  if (props.filename) return props.filename
  return props.url.split('/').pop() || 'video file'
})

const encodeVideoUrl = (url: string) => {
  if (!url) return url
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      urlObj.pathname = urlObj.pathname
        .split('/')
        .map((seg: string) => (seg ? encodeURIComponent(seg) : seg))
        .join('/')
      return urlObj.toString()
    }
    return url
      .split('/')
      .map((seg) => (seg ? encodeURIComponent(seg) : seg))
      .join('/')
  } catch {
    return url
  }
}

const downloadFile = async () => {
  if (isDisabled.value) return
  try {
    const link = document.createElement('a')
    link.href = encodeVideoUrl(props.url)
    link.download = downloadFilename.value
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch {
    window.open(encodeVideoUrl(props.url), '_blank')
  }
}

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlayerVisible = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const showPlayer = () => {
  if (isDisabled.value) return
  isPlayerVisible.value = true
}

const hidePlayer = () => {
  isPlayerVisible.value = false
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
}

const handleLoadStart = () => {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''
}

const handleCanPlay = () => {
  isLoading.value = false
}

const handleError = (event: Event) => {
  hasError.value = true
  isLoading.value = false
  const error = (event.target as HTMLVideoElement)?.error
  if (error) {
    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        errorMessage.value = theme.value.t.videoFile.videoPlaybackAborted
        break
      case error.MEDIA_ERR_NETWORK:
        errorMessage.value = theme.value.t.videoFile.networkErrorLoadingVideo
        break
      case error.MEDIA_ERR_DECODE:
        errorMessage.value = theme.value.t.videoFile.videoDecodingError
        break
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage.value = theme.value.t.videoFile.videoFormatNotSupported
        break
      default:
        errorMessage.value = theme.value.t.videoFile.unknownVideoError
    }
  } else {
    errorMessage.value = theme.value.t.videoFile.errorLoadingVideoFile
  }
}

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
})
</script>

<template>
  <div
    class="video-file flex flex-col rounded-xl gap-4 mb-[0.325rem] transition-all duration-200"
    :class="props.containerClass"
    role="region"
    :aria-label="`${theme.t.videoFile.videoFile}: ${downloadFilename}`"
  >
    <!-- Header: play button, filename, download button -->
    <div class="file-header flex items-center gap-3 px-4 py-3">
      <!-- Play button -->
      <NeptuBtn
        v-if="!isPlayerVisible"
        :primary="true"
        class="play-btn-header"
        :disabled="isDisabled || hasError"
        :title="theme.t.videoFile.playVideo"
        :aria-label="theme.t.videoFile.startVideoPlayback"
        :icon="isLoading ? 'mdi:loading' : 'mdi:play'"
        :icon-class="{ spinning: isLoading }"
        role="button"
        tabindex="0"
        @click="showPlayer"
      />

      <!-- File info -->
      <div class="file-info flex gap-3 min-w-0 flex-1" :class="{ 'has-hint': $slots.default }">
        <div class="video-file-icon flex items-center justify-center w-10 h-10 rounded-lg"></div>
        <div class="video-file-info flex-1 min-w-0">
          <div class="text-xs mt-1 font-medium text-sm break-all" :aria-label="`${theme.t.videoFile.videoFile}: ${downloadFilename}`">
            {{ downloadFilename }}
          </div>
          <div v-if="$slots.default" class="file-hint text-xs mt-1">
            <slot />
          </div>
        </div>
      </div>

      <!-- Download button -->
      <NeptuBtn
        icon="mdi:download"
        :disabled="isDisabled"
        :text="theme.t.videoFile.downloadFile"
        class="download-btn-header shrink-0"
        :aria-label="`${theme.t.videoFile.downloadVideoFile} ${downloadFilename}`"
        role="button"
        tabindex="0"
        @click="downloadFile"
      />
    </div>

    <!-- Video player (shown when play is clicked) -->
    <div
      v-if="isPlayerVisible"
      class="video-player flex flex-col gap-3 p-4 rounded-lg border"
      role="group"
      :aria-label="`${theme.t.videoFile.videoFile} controls for ${downloadFilename}`"
    >
      <!-- Toolbar: hide button -->
      <div class="player-toolbar flex items-center gap-2">
        <NeptuBtn
          class="hide-btn"
          :title="theme.t.videoFile.hidePlayerTitle"
          :aria-label="theme.t.videoFile.hidePlayer"
          icon="mdi:chevron-up"
          role="button"
          tabindex="0"
          @click="hidePlayer"
        />
        <span class="text-sm text-[var(--vp-c-text-2)] ml-1 truncate">{{ downloadFilename }}</span>
      </div>

      <!-- Native video element -->
      <video
        ref="videoRef"
        class="video-element w-full rounded-lg"
        :src="encodeVideoUrl(props.url)"
        controls
        preload="metadata"
        aria-label="downloadFilename"
        @loadstart="handleLoadStart"
        @canplay="handleCanPlay"
        @error="handleError"
      />
    </div>

    <!-- Error message -->
    <div v-if="hasError" class="error-message flex items-center gap-2 px-4 py-3 rounded-md text-sm" role="alert" aria-live="polite">
      <Icon icon="mdi:alert-circle" aria-hidden="true" />
      <span>{{ errorMessage || theme.t.videoFile.errorLoadingVideoFile }}</span>
      <NeptuBtn
        class="retry-btn"
        :aria-label="theme.t.videoFile.retry"
        icon="mdi:refresh"
        :text="theme.t.videoFile.retry"
        @click="() => { hasError = false; errorMessage = ''; isPlayerVisible = false }"
      />
    </div>
  </div>
</template>

<style scoped>
.video-file {
  padding: 1rem;
  padding-left: 2rem;
  border: 1px solid var(--gray-150);
  background: #ffffff;
  border-left: 4px solid var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .video-file {
  background: var(--gray-850);
  border-color: var(--gray-800);
  border-left-color: var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.file-header {
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.file-hint {
  color: var(--vp-c-text-2);
}

.dark .file-hint {
  color: var(--gray-400);
}

.video-player {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

.dark .video-player {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-divider);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.video-element {
  max-height: 480px;
  background: #000;
}

.error-message {
  color: var(--vp-c-danger-1);
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.error-message .iconify {
  color: #dc2626;
  flex-shrink: 0;
}

.dark .error-message {
  background: #7f1d1d;
  border-color: #dc2626;
  color: #fca5a5;
}

.dark .error-message .iconify {
  color: #fca5a5;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .video-file {
    padding: 0.75rem;
    padding-left: 1.5rem;
  }

  .file-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .file-info {
    order: 2;
    width: 100%;
    margin-top: 0.5rem;
  }

  .download-btn-header {
    order: 3;
    width: 100%;
    justify-content: center;
  }
}
</style>
