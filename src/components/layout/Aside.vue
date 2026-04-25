<template>
  <aside v-if="$slots.default" class="aside-container">
    <div class="aside-content">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
// Компонент для отображения боковой панели (aside)
// Показывается только на широких экранах (1550px и выше)
// Ширина соответствует стандартному рекламному блоку Google (300px)
// Отображается только если есть контент в слоте по умолчанию
</script>

<style scoped>
.aside-container {
  /* Скрываем на экранах меньше 1550px */
  display: none;
}

/* Показываем только на широких экранах */
@media (min-width: 1550px) {
  .aside-container {
    display: block;
    width: 300px; /* Стандартная ширина рекламного блока Google */
    min-width: 300px;
    max-width: 300px;
    padding: 0 16px;
    margin-left: 24px;
  }
}

.aside-content {
  width: 100%;
  position: sticky;
  top: 100px; /* Отступ от верха для лучшего позиционирования */
}
</style>
