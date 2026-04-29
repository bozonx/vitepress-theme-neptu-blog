<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useLightbox, useLightboxLocales } from '../../composables/useLightbox.ts'

const { isOpen, currentIndex, items, close, next, prev } = useLightbox()
const locales = useLightboxLocales()

const currentItem = computed(() => items.value[currentIndex.value])
const hasMultiple = computed(() => items.value.length > 1)
const loaded = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)

let touchStartX = 0
let touchStartY = 0

watch(currentIndex, () => {
  loaded.value = false
})

watch(isOpen, async (open) => {
  if (open) {
    loaded.value = false
    await nextTick()
    containerRef.value?.focus()
  }
})

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  switch (e.key) {
    case 'Escape':
      e.preventDefault()
      close()
      break
    case 'ArrowLeft':
      e.preventDefault()
      prev()
      break
    case 'ArrowRight':
      e.preventDefault()
      next()
      break
  }
}

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  touchStartX = t.clientX
  touchStartY = t.clientY
}

function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches[0]
  if (!t) return
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if (Math.abs(dy) > Math.abs(dx)) return
  if (Math.abs(dx) < 50) return
  if (dx < 0) {
    next()
  } else {
    prev()
  }
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <teleport to="#modals">
    <transition name="lightbox">
      <div
        v-if="isOpen"
        ref="containerRef"
        class="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @click="onBackdropClick"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- Close button -->
        <button
          class="lightbox-btn lightbox-close"
          :aria-label="locales.close || 'Close'"
          @click="close"
        >
          <Icon icon="mdi:close" />
        </button>

        <!-- Prev button -->
        <button
          v-if="hasMultiple"
          class="lightbox-btn lightbox-prev"
          :aria-label="locales.prev || 'Previous'"
          @click="prev"
        >
          <Icon icon="mdi:chevron-left" />
        </button>

        <!-- Image container -->
        <figure class="lightbox-figure">
          <div v-if="!loaded" class="lightbox-loader" role="status">
            <Icon icon="mdi:loading" class="lightbox-spinner" />
            <span class="sr-only">{{ locales.loadingIndicatorLabel || 'Loading...' }}</span>
          </div>
          <img
            v-show="loaded"
            :src="currentItem?.src"
            :alt="currentItem?.alt || ''"
            class="lightbox-img"
            @load="loaded = true"
          />
          <figcaption v-if="currentItem?.alt" class="lightbox-caption">
            {{ currentItem.alt }}
          </figcaption>
        </figure>

        <!-- Next button -->
        <button
          v-if="hasMultiple"
          class="lightbox-btn lightbox-next"
          :aria-label="locales.next || 'Next'"
          @click="next"
        >
          <Icon icon="mdi:chevron-right" />
        </button>

        <!-- Counter -->
        <div v-if="hasMultiple" class="lightbox-counter" aria-hidden="true">
          {{ currentIndex + 1 }} / {{ items.length }}
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(4px);
  outline: none;
}

.lightbox-figure {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.lightbox-loader {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.lightbox-spinner {
  width: 40px;
  height: 40px;
  animation: lightbox-spin 1s linear infinite;
}

@keyframes lightbox-spin {
  to {
    transform: rotate(360deg);
  }
}

.lightbox-caption {
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  text-align: center;
  max-width: 100%;
}

.lightbox-btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 24px;
  z-index: 101;
}

.lightbox-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-close {
  top: 16px;
  right: 16px;
}

.lightbox-prev {
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-next {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-counter {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .lightbox-figure {
    max-width: 95vw;
    max-height: 90vh;
  }

  .lightbox-img {
    max-height: 75vh;
  }

  .lightbox-prev,
  .lightbox-next {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  .lightbox-prev {
    left: 8px;
  }

  .lightbox-next {
    right: 8px;
  }
}

/* Vue transition */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
