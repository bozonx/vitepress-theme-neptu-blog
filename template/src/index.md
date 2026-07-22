---
layout: false
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { useData, inBrowser } from 'vitepress'
import { onMounted } from 'vue'

const { site } = useData()
const base = site.value.base || '/'

onMounted(() => {
  if (inBrowser && window.location.pathname === base) {
    window.location.replace(base + 'en/')
  }
})
</script>
