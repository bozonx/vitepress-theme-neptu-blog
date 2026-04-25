<script setup lang="ts"></script>

<template>
  <div class="notfound-page">
    <div>
      <h1 class="notfound-page-message">404 not found</h1>
      <div class="notfound-page-link">
        <a class="simple-link" href="/">return to home</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound-page {
  height: 100vh;
  background: var(--gray-900);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notfound-page-message {
  color: white;
  font-size: 2.5rem;
}

.notfound-page-link {
  font-size: 1.25rem;
  margin-top: 0.25rem;
}
</style>
