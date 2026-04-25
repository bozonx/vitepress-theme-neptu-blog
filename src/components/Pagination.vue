<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import Btn from './Btn.vue'

const route = useRoute()
const { theme } = useData()
const props = defineProps<{
  paginationMaxItems?: number
  curPage: number
  totalPages: number
  paginationBaseUrl?: string
}>()
const items: any[] = []

const curPage = props.curPage
const maxItems = props.paginationMaxItems || theme.value.paginationMaxItems
const totalPages = props.totalPages
const baseUrl =
  props.paginationBaseUrl || route.path.split('/').slice(0, -1).join('/')

// example
// const curPage = 4;
// const maxItems = 7;
// const totalPages = 4;

if (curPage >= 1 && totalPages > 1 && curPage <= totalPages) {
  const halfPages = (maxItems - 1) / 2
  let minusPages = halfPages
  let plusPages = halfPages

  // Распределяем нечетное количество страниц: больше страниц справа от текущей
  if (halfPages !== Math.ceil(halfPages)) {
    minusPages = Math.floor(halfPages)
    plusPages = Math.ceil(halfPages)
  }

  let startPage = curPage - minusPages
  let endPage = curPage + plusPages

  // Корректируем границы если выходим за пределы
  if (startPage < 1) {
    // Если начинаем раньше первой страницы, сдвигаем вправо
    const shift = 1 - startPage
    startPage = 1
    endPage = Math.min(endPage + shift, totalPages)
  } else if (endPage > totalPages) {
    // Если заканчиваем после последней страницы, сдвигаем влево
    const shift = endPage - totalPages
    endPage = totalPages
    startPage = Math.max(startPage - shift, 1)
  }

  // Показываем кнопку "в начало" если не показываем первую страницу
  if (startPage > 1) {
    items.push({
      // name: '<<',
      icon: 'mdi:page-first',
      href: `${baseUrl}/1`,
      title: theme.value.t.paginationToStart,
    })
  }

  // Добавляем номера страниц
  for (let i = startPage; i <= endPage; i++) {
    items.push({ name: i, href: `${baseUrl}/${i}` })
  }

  // Показываем кнопку "в конец" если не показываем последнюю страницу
  if (endPage < totalPages) {
    items.push({
      // name: '>>',
      icon: 'mdi:page-last',
      href: `${baseUrl}/${totalPages}`,
      title: theme.value.t.paginationToEnd,
    })
  }
}
</script>

<template>
  <ul v-if="items.length" class="flex justify-center gap-x-1">
    <li v-for="item of items" class="flex align-center">
      <Btn
        :href="item.href"
        :title="item.title"
        :text="item.name"
        :icon="item.icon"
        class="px-3 pagination-btn"
      />
    </li>
  </ul>
</template>

<style scoped>
.pagination-btn {
  padding: 0.35rem 1rem;
}
</style>
