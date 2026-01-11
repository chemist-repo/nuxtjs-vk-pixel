<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()

onMounted(() => {
  nuxtApp.$vkPixel.push({})
})
</script>
