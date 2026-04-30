<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import Btn from '../Btn.vue'
import { useUiTheme } from '../../composables/useUiTheme.ts'

const { theme } = useUiTheme()

// Component props
const props = defineProps({
  // Audio file URL
  url: { type: String, required: true },
  // If the filename is not detected correctly, specify it manually
  filename: { type: String, default: '' },
  // CSS classes
  containerClass: { type: String, default: '' },
  // Disable buttons
  disabled: { type: Boolean, default: false },
})

// Button disabled state
const isDisabled = ref(props.disabled)

// Computed filename for download (used in the download attribute)
const downloadFilename = computed(() => {
  if (props.filename) {
    return props.filename
  }

  // Extract full filename with extension from URL
  return props.url.split('/').pop() || 'audio file'
})

// URL validation for security
const isValidUrl = (url: unknown) => {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    // Try standard validation first
    new URL(url)
    return true
  } catch {
    // If standard validation failed, check for relative paths and URLs with spaces
    // Allow relative paths (starting with /)
    if (url.startsWith('/')) {
      return true
    }

    // Allow URLs with spaces (encoded or not)
    // Check basic URL structure
    const urlPattern = /^(https?:\/\/|\.\/|\/|data:|blob:)/i
    if (urlPattern.test(url)) {
      return true
    }

    // Ensure it is not an empty string and contains at least a dot (for files)
    if (url.includes('.') && url.length > 3) {
      return true
    }

    return false
  }
}

// URL encoding to handle spaces and special characters correctly
const encodeAudioUrl = (url: string) => {
  if (!url) return url

  try {
    // For full URLs, encode only the filename
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      // Encode only the path, preserving other URL parts
      urlObj.pathname = urlObj.pathname
        .split('/')
        .map((segment: string) => (segment ? encodeURIComponent(segment) : segment))
        .join('/')
      return urlObj.toString()
    }

    // For relative paths, encode the entire path
    return url
      .split('/')
      .map((segment: any) => (segment ? encodeURIComponent(segment) : segment))
      .join('/')
  } catch {
    // If URL parsing failed, return the original
    return url
  }
}

const downloadFile = async () => {
  if (isDisabled.value) return

  try {
    // Validate URL
    if (!isValidUrl(props.url)) {
      hasError.value = true
      errorMessage.value = theme.value.t.audioFile.invalidUrlProvided
      console.error('Invalid URL provided')
      return
    }

    // Create a temporary link for downloading
    const link = document.createElement('a')
    link.href = encodeAudioUrl(props.url)
    link.download = downloadFilename.value
    link.target = '_blank'

    // Append link to DOM, click it, then remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    hasError.value = true
    errorMessage.value = theme.value.t.audioFile.errorDownloadingFile
    console.error('Error downloading file:', error)
    // On error, open the file in a new tab
    window.open(encodeAudioUrl(props.url), '_blank')
  }
}

// Audio player state
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isLoading = ref(false)
const hasError = ref(false)
const isPlayerVisible = ref(false)
const isAudioLoaded = ref(false)
const errorMessage = ref('')

// Debounce function for performance optimization
const debounce = (func: Function, wait: number) => {
  let timeout: any
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Audio player control methods
const togglePlayPause = async () => {
  if (isDisabled.value || hasError.value) return

  try {
    // Validate URL before playback
    if (!isValidUrl(props.url)) {
      hasError.value = true
      errorMessage.value = theme.value.t.audioFile.invalidAudioUrlProvided
      console.error('Invalid audio URL provided')
      return
    }

    if (!audioRef.value) return

    // If player is not visible, show it and start playback
    if (!isPlayerVisible.value) {
      isPlayerVisible.value = true
      // Wait for next tick for player appearance animation
      await nextTick()
      if (audioRef.value) {
        await audioRef.value.play()
      }
      return
    }

    // If player is visible, toggle play/pause
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      await audioRef.value.play()
    }
  } catch (error) {
    console.error('Error playing audio:', error)
    hasError.value = true
    errorMessage.value = theme.value.t.audioFile.errorPlayingAudioFile
  }
}

const stopAudio = () => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    isPlaying.value = false
  }
}

// Hide player
const hidePlayer = () => {
  isPlayerVisible.value = false
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    isPlaying.value = false
  }
}

const seekTo = (time: number) => {
  if (audioRef.value && !isDisabled.value) {
    audioRef.value.currentTime = time
  }
}

const setVolume = (newVolume: number | string) => {
  if (audioRef.value) {
    const volumeValue = typeof newVolume === 'string' ? parseFloat(newVolume) : newVolume
    audioRef.value.volume = volumeValue
    volume.value = volumeValue
  }
}

// Progress bar click handler
const handleProgressClick = (event: MouseEvent) => {
  if (isDisabled.value || !duration.value) return

  const progressBar = event.currentTarget as HTMLElement | null
  if (!progressBar) return
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value

  seekTo(newTime)
}

// Progress bar keyboard handler
const handleProgressKeydown = (event: KeyboardEvent) => {
  if (isDisabled.value || !duration.value) return

  const step = duration.value * 0.05 // 5% of total duration
  let newTime = currentTime.value

  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault()
      newTime = Math.max(0, currentTime.value - step)
      break
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault()
      newTime = Math.min(duration.value, currentTime.value + step)
      break
    case 'Home':
      event.preventDefault()
      newTime = 0
      break
    case 'End':
      event.preventDefault()
      newTime = duration.value
      break
    default:
      return
  }

  seekTo(newTime)
}

// Audio event handlers
const handleLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
    isLoading.value = false
    isAudioLoaded.value = true
    // Set volume after metadata load
    audioRef.value.volume = volume.value
  }
}

// Debounced version of handleTimeUpdate for performance optimization
const handleTimeUpdateDebounced = debounce(() => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}, 100)

const handleTimeUpdate = () => {
  handleTimeUpdateDebounced()
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const handleLoadStart = () => {
  isLoading.value = true
  hasError.value = false
  isAudioLoaded.value = false
  errorMessage.value = ''
}

const handleError = (event: any) => {
  hasError.value = true
  isLoading.value = false
  isPlaying.value = false
  isAudioLoaded.value = false

  // Detailed error handling
  const error = event.target.error
  if (error) {
    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        errorMessage.value = theme.value.t.audioFile.audioPlaybackAborted
        console.error('Audio playback was aborted')
        break
      case error.MEDIA_ERR_NETWORK:
        errorMessage.value = theme.value.t.audioFile.networkErrorLoadingAudio
        console.error('Network error occurred while loading audio')
        break
      case error.MEDIA_ERR_DECODE:
        errorMessage.value = theme.value.t.audioFile.audioDecodingError
        console.error('Audio decoding error')
        break
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage.value = theme.value.t.audioFile.audioFormatNotSupported
        console.error('Audio format not supported')
        break
      default:
        errorMessage.value = theme.value.t.audioFile.unknownAudioError
        console.error('Unknown audio error occurred')
    }
  } else {
    errorMessage.value = theme.value.t.audioFile.errorLoadingAudioFile
  }
}

// Time formatting
const formatTime = (time: any) => {
  if (!time || !isFinite(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Progress bar percentage formatting
const progressPercent = computed(() => {
  if (!duration.value || !isFinite(duration.value)) {
    return 0
  }
  return (currentTime.value / duration.value) * 100
})

// Initialize on component mount
onMounted(() => {
  // Event handlers are now only in template, removing duplication
  // Set default volume
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  // Cleanup is not needed because handlers are only in template
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
})
</script>

<template>
  <div
    class="audio-file flex flex-col rounded-xl gap-4 mb-[0.325rem] transition-all duration-200"
    :class="props.containerClass"
    role="region"
    :aria-label="`${theme.t.audioFile.audioFile}: ${downloadFilename}`"
  >
    <!-- Hidden audio element with lazy loading -->
    <audio
      ref="audioRef"
      :src="isPlayerVisible ? encodeAudioUrl(props.url) : undefined"
      :preload="isPlayerVisible ? 'metadata' : 'none'"
      aria-hidden="true"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @loadstart="handleLoadStart"
      @error="handleError"
    />

    <!-- First row: play button, filename, download button -->
    <div class="file-header flex items-center gap-3 px-4 py-3">
      <!-- Play button -->
      <Btn
        v-if="!isPlayerVisible"
        :primary="true"
        class="play-btn-header"
        :disabled="isDisabled || hasError"
        :title="
          isPlaying ? theme.t.audioFile.pauseAudio : theme.t.audioFile.playAudio
        "
        :aria-label="
          isPlaying
            ? theme.t.audioFile.pauseAudioPlayback
            : theme.t.audioFile.startAudioPlayback
        "
        :aria-pressed="isPlaying"
        role="button"
        tabindex="0"
        :icon="isLoading ? 'mdi:loading' : 'mdi:play'"
        :icon-class="{ spinning: isLoading }"
        @click="togglePlayPause"
      />

      <!-- File info -->
      <div class="file-info flex gap-3 min-w-0 flex-1" :class="{ 'has-hint': $slots.default }">
        <div class="audio-file-icon flex items-center justify-center w-10 h-10 rounded-lg"></div>
        <div class="audio-file-info flex-1 min-w-0">
          <div class="text-xs mt-1 font-medium text-sm break-all" :aria-label="`${theme.t.audioFile.audioFile}: ${downloadFilename}`">
            {{ downloadFilename }}
          </div>
          <div v-if="$slots.default" class="file-hint text-xs mt-1">
            <slot />
          </div>
        </div>
      </div>

      <!-- Download button -->
      <a
        :href="url"
        :download="downloadFilename"
        class="audio-file-download flex items-center justify-center w-8 h-8 rounded-md"
      >
        <Btn
          icon="mdi:download"
          :disabled="isDisabled"
          :text="theme.t.audioFile.downloadFile"
          class="download-btn-header shrink-0"
          :aria-label="`${theme.t.audioFile.downloadAudioFile} ${downloadFilename}`"
          role="button"
          tabindex="0"
          @click="downloadFile"
        />
      </a>
    </div>

    <!-- Audio player (shown when play is clicked) -->
    <div
      v-if="isPlayerVisible"
      class="audio-player flex flex-col gap-3 p-4 rounded-lg border"
      role="group"
      :aria-label="`${theme.t.audioFile.audioFile} controls for ${downloadFilename}`"
    >
      <!-- Main controls -->
      <div
        class="player-controls flex items-center gap-3"
        role="toolbar"
        :aria-label="theme.t.audioFile.audioFile + ' playback controls'"
      >
        <!-- Play/pause button -->
        <Btn
          class="play-btn"
          :primary="true"
          :disabled="isDisabled || hasError"
          :title="
            isPlaying
              ? theme.t.audioFile.pauseAudio
              : theme.t.audioFile.playAudio
          "
          :aria-label="
            isPlaying
              ? theme.t.audioFile.pauseAudioPlayback
              : theme.t.audioFile.resumeAudioPlayback
          "
          :aria-pressed="isPlaying"
          role="button"
          tabindex="0"
          :icon="
            isLoading ? 'mdi:loading' : isPlaying ? 'mdi:pause' : 'mdi:play'
          "
          :icon-class="{ spinning: isLoading }"
          @click="togglePlayPause"
        />

        <!-- Stop button -->
        <Btn
          class="stop-btn"
          :disabled="isDisabled || hasError || !isPlaying"
          :title="theme.t.audioFile.stopAudio"
          :aria-label="theme.t.audioFile.stopAudioPlayback"
          role="button"
          tabindex="0"
          icon="mdi:stop"
          @click="stopAudio"
        />

        <!-- Hide player button -->
        <Btn
          class="hide-btn"
          :title="theme.t.audioFile.hidePlayerTitle"
          :aria-label="theme.t.audioFile.hidePlayer"
          role="button"
          tabindex="0"
          icon="mdi:chevron-up"
          @click="hidePlayer"
        />

        <!-- Время -->
        <div
          class="time-display text-sm ml-auto flex items-center gap-1 h-7 min-w-0 font-medium px-2.5 rounded"
          role="timer"
          :aria-label="`${theme.t.audioFile.currentTime}: ${formatTime(currentTime)} of ${formatTime(duration)}`"
        >
          <span class="current-time" aria-hidden="true">{{
            formatTime(currentTime)
          }}</span>
          <span class="time-separator" aria-hidden="true">/</span>
          <span class="total-time" aria-hidden="true">{{
            formatTime(duration)
          }}</span>
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div class="progress-container px-4 flex-1 min-w-0">
        <div
          class="progress-bar flex items-center gap-3 cursor-pointer py-3 outline-none rounded transition-all duration-200"
          role="slider"
          :aria-label="`${theme.t.audioFile.audioProgress}: ${Math.round(progressPercent)}%`"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="Math.round(progressPercent)"
          :aria-valuetext="`${formatTime(currentTime)} of ${formatTime(duration)}`"
          tabindex="0"
          @click="handleProgressClick"
          @keydown="handleProgressKeydown"
        >
          <div class="progress-track flex h-1 rounded-sm overflow-hidden w-full relative">
            <div
              class="progress-fill h-full rounded-sm min-w-0 relative"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Контрол громкости -->
      <div class="volume-control flex items-center gap-2">
        <Icon icon="mdi:volume-high" class="volume-icon text-xl" aria-hidden="true" />
        <input
          v-model="volume"
          class="volume-slider w-full"
          type="range"
          min="0"
          max="1"
          step="0.1"
          :aria-label="`${theme.t.audioFile.volumeControl}: ${Math.round(volume * 100)}%`"
          role="slider"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="Math.round(volume * 100)"
          :aria-valuetext="`${Math.round(volume * 100)}% ${theme.t.audioFile.volumePercent}`"
          @input="setVolume(($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="hasError" class="error-message flex items-center gap-2 px-4 py-3 rounded-md text-sm" role="alert" aria-live="polite">
      <Icon icon="mdi:alert-circle" aria-hidden="true" />
      <span>{{ errorMessage || theme.t.audioFile.errorLoadingAudioFile }}</span>
      <Btn
        v-if="!isValidUrl(props.url)"
        class="retry-btn"
        :aria-label="theme.t.audioFile.retryWithValidUrl"
        icon="mdi:refresh"
        :text="theme.t.audioFile.retry"
        @click="
          () => {
            hasError = false
            errorMessage = ''
          }
        "
      />
    </div>
  </div>
</template>

<style scoped>
.audio-file {
  padding: 1rem;
  padding-left: 2rem;
  border: 1px solid var(--gray-150);
  background: #ffffff;
  border-left: 4px solid var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .audio-file {
  background: var(--gray-850);
  border-color: var(--gray-800);
  border-left-color: var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Заголовок файла - первая строка */
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

/* Аудио плеер */
.audio-player {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

.dark .audio-player {
  background: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.time-display {
  color: var(--gray-600);
  font-family: var(--vp-font-family-mono, ui-monospace, 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace);
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
}

.dark .time-display {
  color: var(--gray-400);
  background: var(--gray-800);
  border-color: var(--gray-700);
}

.time-separator {
  color: var(--gray-400);
  font-weight: 400;
}

.dark .time-separator {
  color: var(--gray-500);
}

/* Прогресс-бар */
.progress-bar:hover {
  background: rgba(59, 130, 246, 0.05);
}

.dark .progress-track {
  background: var(--gray-700);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  transition: width 0.1s linear;
  background: var(--vp-c-brand-1);
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  background: var(--vp-c-brand-1);
}

/* Контрол громкости */
.volume-slider {
  appearance: none;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.volume-slider:focus {
  outline: none;
}

.dark .volume-slider {
  background: var(--gray-700);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.volume-slider:hover {
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.15),
    0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark .volume-slider:hover {
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.4),
    0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Сообщение об ошибке */
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

/* Анимация загрузки */
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .audio-file {
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
