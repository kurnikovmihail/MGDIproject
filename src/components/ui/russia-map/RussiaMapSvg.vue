<script setup>
defineProps({
  svgMarkup: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div v-html="svgMarkup" />
</template>
