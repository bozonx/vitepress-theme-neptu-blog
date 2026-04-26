<template>
  <aside v-if="$slots.default" class="aside-container">
    <div class="aside-content">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
// Component for rendering the aside panel
// Visible only on wide screens (1550px and above)
// Width matches the standard Google ad block (300px)
// Visible only if default slot content exists
</script>

<style scoped>
.aside-container {
  /* Hide on screens below 1550px */
  display: none;
}

/* Show only on wide screens */
@media (min-width: 1550px) {
  .aside-container {
    display: block;
    width: 300px; /* Standard Google ad block width */
    min-width: 300px;
    max-width: 300px;
    padding: 0 16px;
    margin-left: 24px;
  }
}

.aside-content {
  width: 100%;
  position: sticky;
  top: 100px; /* Top offset for better positioning */
}
</style>
