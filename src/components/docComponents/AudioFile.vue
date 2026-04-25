<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import Btn from '../Btn.vue'
import { useData } from 'vitepress'

const { theme } = useData()

// Пропсы компонента
const props = defineProps({
  // URL аудио файла
  url: { type: String, required: true },
  // Если не правильно определилось имя то укажите его здесь самостоятельно
  filename: { type: String, default: '' },
  // CSS классы
  containerClass: { type: String, default: '' },
  // Отключить кнопки
  disabled: { type: Boolean, default: false },
})

// Состояние отключения кнопок
const isDisabled = ref(props.disabled)

// Вычисляемое имя файла для скачивания (используется в download атрибуте)
const downloadFilename = computed(() => {
  if (props.filename) {
    return props.filename
  }

  // Извлекаем полное имя файла с расширением из URL
  return props.url.split('/').pop() || 'audio file'
})

// Валидация URL для безопасности
const isValidUrl = (url: any) => {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    // Сначала пробуем стандартную валидацию
    new URL(url)
    return true
  } catch {
    // Если не прошла стандартная валидация, проверяем на относительные пути и URL с пробелами
    // Разрешаем относительные пути (начинающиеся с /)
    if (url.startsWith('/')) {
      return true
    }

    // Разрешаем URL с пробелами (закодированные или нет)
    // Проверяем базовую структуру URL
    const urlPattern = /^(https?:\/\/|\.\/|\/|data:|blob:)/i
    if (urlPattern.test(url)) {
      return true
    }

    // Проверяем, что это не пустая строка и содержит хотя бы точку (для файлов)
    if (url.includes('.') && url.length > 3) {
      return true
    }

    return false
  }
}

// Кодирование URL для корректной работы с пробелами и специальными символами
const encodeAudioUrl = (url: any) => {
  if (!url) return url

  try {
    // Если это полный URL, кодируем только имя файла
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      // Кодируем только путь, сохраняя остальные части URL
      urlObj.pathname = urlObj.pathname
        .split('/')
        .map((segment: any) => (segment ? encodeURIComponent(segment) : segment))
        .join('/')
      return urlObj.toString()
    }

    // Для относительных путей кодируем весь путь
    return url
      .split('/')
      .map((segment: any) => (segment ? encodeURIComponent(segment) : segment))
      .join('/')
  } catch {
    // Если не удалось разобрать URL, возвращаем исходный
    return url
  }
}

const downloadFile = async () => {
  if (isDisabled.value) return

  try {
    // Проверяем валидность URL
    if (!isValidUrl(props.url)) {
      hasError.value = true
      errorMessage.value = theme.value.t.audioFile.invalidUrlProvided
      console.error('Invalid URL provided')
      return
    }

    // Создаем временную ссылку для скачивания
    const link = document.createElement('a')
    link.href = encodeAudioUrl(props.url)
    link.download = downloadFilename.value
    link.target = '_blank'

    // Добавляем ссылку в DOM, кликаем и удаляем
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    hasError.value = true
    errorMessage.value = theme.value.t.audioFile.errorDownloadingFile
    console.error('Error downloading file:', error)
    // В случае ошибки открываем файл в новой вкладке
    window.open(encodeAudioUrl(props.url), '_blank')
  }
}

// Состояние аудио плеера
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

// Debounce функция для оптимизации производительности
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

// Методы управления аудио плеером
const togglePlayPause = async () => {
  if (isDisabled.value || hasError.value) return

  try {
    // Проверяем валидность URL перед воспроизведением
    if (!isValidUrl(props.url)) {
      hasError.value = true
      errorMessage.value = theme.value.t.audioFile.invalidAudioUrlProvided
      console.error('Invalid audio URL provided')
      return
    }

    if (!audioRef.value) return

    // Если плеер не виден, показываем его и начинаем воспроизведение
    if (!isPlayerVisible.value) {
      isPlayerVisible.value = true
      // Ждем следующий тик для анимации появления плеера
      await nextTick()
      if (audioRef.value) {
        await audioRef.value.play()
      }
      return
    }

    // Если плеер виден, переключаем воспроизведение/паузу
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

// Метод для скрытия плеера
const hidePlayer = () => {
  isPlayerVisible.value = false
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    isPlaying.value = false
  }
}

const seekTo = (time: any) => {
  if (audioRef.value && !isDisabled.value) {
    audioRef.value.currentTime = time
  }
}

const setVolume = (newVolume: any) => {
  if (audioRef.value) {
    const volumeValue = parseFloat(newVolume)
    audioRef.value.volume = volumeValue
    volume.value = volumeValue
  }
}

// Обработка клика по прогресс-бару
const handleProgressClick = (event: any) => {
  if (isDisabled.value || !duration.value) return

  const progressBar = event.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value

  seekTo(newTime)
}

// Обработка клавиатуры для прогресс-бара
const handleProgressKeydown = (event: any) => {
  if (isDisabled.value || !duration.value) return

  const step = duration.value * 0.05 // 5% от общей длительности
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

// Обработчики событий аудио
const handleLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
    isLoading.value = false
    isAudioLoaded.value = true
    // Устанавливаем громкость после загрузки метаданных
    audioRef.value.volume = volume.value
  }
}

// Debounced версия handleTimeUpdate для оптимизации производительности
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

  // Более детальная обработка ошибок
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

// Форматирование времени
const formatTime = (time: any) => {
  if (!time || !isFinite(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Форматирование процентов для прогресс-бара
const progressPercent = computed(() => {
  if (!duration.value || !isFinite(duration.value)) {
    return 0
  }
  return (currentTime.value / duration.value) * 100
})

// Инициализация при монтировании компонента
onMounted(() => {
  // Обработчики событий теперь только в template, убираем дублирование
  // Устанавливаем громкость по умолчанию
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

// Очистка при размонтировании
onUnmounted(() => {
  // Очистка не нужна, так как обработчики только в template
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
})
</script>

<template>
  <div
    class="audio-file"
    :class="props.containerClass"
    role="region"
    :aria-label="`${theme.t.audioFile.audioFile}: ${downloadFilename}`"
  >
    <!-- Скрытый audio элемент с lazy loading -->
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

    <!-- Первая строка: кнопка play, название файла, кнопка скачать -->
    <div class="file-header">
      <!-- Кнопка воспроизведения -->
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

      <!-- Информация о файле -->
      <div class="file-info" :class="{ 'has-hint': $slots.default }">
        <div class="file-details">
          <div
            class="file-name muted"
            :aria-label="`${theme.t.audioFile.audioFile}: ${downloadFilename}`"
          >
            {{ downloadFilename }}
          </div>
          <div v-if="$slots.default" class="file-hint">
            <slot />
          </div>
        </div>
      </div>

      <!-- Кнопка скачивания -->
      <Btn
        icon="mdi:download"
        :disabled="isDisabled"
        :text="theme.t.audioFile.downloadFile"
        class="download-btn-header"
        :aria-label="`${theme.t.audioFile.downloadAudioFile} ${downloadFilename}`"
        role="button"
        tabindex="0"
        @click="downloadFile"
      />
    </div>

    <!-- Аудио плеер (показывается при нажатии на play) -->
    <div
      v-if="isPlayerVisible"
      class="audio-player"
      role="group"
      :aria-label="`${theme.t.audioFile.audioFile} controls for ${downloadFilename}`"
    >
      <!-- Основные контролы -->
      <div
        class="player-controls"
        role="toolbar"
        :aria-label="theme.t.audioFile.audioFile + ' playback controls'"
      >
        <!-- Кнопка воспроизведения/паузы -->
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

        <!-- Кнопка остановки -->
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

        <!-- Кнопка скрытия плеера -->
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
          class="time-display"
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
      <div class="progress-container">
        <div
          class="progress-bar"
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
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: `${Math.max(progressPercent, 0.1)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Контрол громкости -->
      <div class="volume-control">
        <Icon icon="mdi:volume-high" class="volume-icon" aria-hidden="true" />
        <input
          v-model="volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          class="volume-slider"
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
    <div v-if="hasError" class="error-message" role="alert" aria-live="polite">
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
  display: flex;
  flex-direction: column;
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

.dark .audio-file {
  background: var(--gray-850);
  border-color: var(--gray-800);
  border-left-color: var(--primary-btn-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Заголовок файла - первая строка */
.file-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.play-btn-header {
  border-radius: 50%;
  transition: all 0.2s ease;
}

.play-btn-header:hover:not(:disabled) {
  transform: scale(1.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
}

.file-info.has-hint {
  align-items: flex-start;
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

.download-btn-header {
  flex-shrink: 0;
}

/* Аудио плеер */
.audio-player {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 0.5rem;
  border: 1px solid var(--gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

.dark .audio-player {
  background: var(--gray-950);
  border-color: var(--gray-800);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.play-btn,
.stop-btn,
.hide-btn {
  border-radius: 50%;
  transition: all 0.2s ease;
}

.play-btn:hover:not(:disabled),
.stop-btn:hover:not(:disabled),
.hide-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.time-display {
  display: flex;
  align-items: center;
  height: 1.75rem;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--gray-600);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  min-width: 0;
  font-weight: 500;
  background: var(--gray-100);
  padding: 0 0.625rem;
  border-radius: 0.25rem;
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
.progress-container {
  flex: 1;
  min-width: 0;
}

.progress-bar {
  cursor: pointer;
  padding: 0.75rem 0;
  outline: none;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.progress-bar:focus {
  outline: 2px solid var(--primary-btn-bg);
  outline-offset: 2px;
}

.progress-bar:hover {
  background: rgba(59, 130, 246, 0.05);
}

.progress-track {
  width: 100%;
  height: 0.5rem;
  background: var(--gray-200);
  border-radius: 0.25rem;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.dark .progress-track {
  background: var(--gray-700);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 0.25rem;
  transition: width 0.2s ease;
  min-width: 0;
  position: relative;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  border-radius: 0.25rem;
}

/* Контрол громкости */
.volume-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0.5rem 0;
}

.volume-icon {
  color: var(--gray-600);
  flex-shrink: 0;
  font-size: 1.25rem;
}

.dark .volume-icon {
  color: var(--gray-400);
}

.volume-slider {
  flex: 1;
  min-width: 0;
  height: 0.375rem;
  background: var(--gray-200);
  border-radius: 0.1875rem;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.volume-slider:focus {
  outline: 2px solid var(--primary-btn-bg);
  outline-offset: 2px;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
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

.retry-btn {
  margin-left: auto;
  flex-shrink: 0;
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
