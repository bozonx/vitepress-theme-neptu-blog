<script setup>
import { useData, inBrowser } from 'vitepress'
import { ref, watchEffect } from 'vue'
import SwitchLang from './components/layout/SwitchLang.vue'

const props = defineProps(['scrollY'])
const { theme } = useData()
const valueY = ref(0)
const wrapperRef = ref(null)
const BG_HEIGHT_OFFSET = theme.value.homeBgParalaxOffset || 0

watchEffect(async () => {
  if (!inBrowser) return

  const totalHeight = wrapperRef.value?.scrollHeight || 0
  const windowHeight = window.innerHeight
  const totalScroll = totalHeight - windowHeight

  // Проверяем, что есть прокрутка и избегаем деления на ноль
  if (totalScroll <= 0) {
    valueY.value = 0
    return
  }

  // Прогресс прокрутки от 0 до 1
  const scrollProgress = Math.min(Math.max(props.scrollY / totalScroll, 0), 1)

  // Правильная формула параллакса: фон движется медленнее чем контент
  // Начальная позиция 0, затем сдвигаемся вверх при прокрутке
  // При полной прокрутке фон должен сдвинуться на полный BG_HEIGHT_OFFSET
  // чтобы показать всю картинку (размер фона: 100vh + BG_HEIGHT_OFFSET)
  //
  // Логика:
  // - scrollProgress = 0: фон в позиции 0 (показываем верх фона)
  // - scrollProgress = 1: фон в позиции -BG_HEIGHT_OFFSET (показываем низ фона)
  valueY.value = -(BG_HEIGHT_OFFSET * scrollProgress)
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="dark home-layout"
    :style="`background-position-y: ${valueY}px; background-size: auto calc(100vh + ${BG_HEIGHT_OFFSET}px);`"
  >
    <div class="home-layout-topbar">
      <SwitchLang dropLeft="true" noBg="true" />
    </div>
    <div class="home-layout-page">
      <Content />
    </div>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position-x: center;
  background-attachment: fixed;
  /* Плавная анимация для параллакс эффекта */
  transition: background-position-y 0.1s ease-out;
}

.home-layout {
  color: white !important;
}

.home-layout-topbar {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem 1.5rem 0 0;
}

.home-layout-page {
  max-width: 800px;
  margin: 5rem 1.75rem;
}
</style>
