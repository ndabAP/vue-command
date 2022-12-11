<script setup>
import { inject, onMounted } from 'vue'

const terminate = inject('terminate')
onMounted(terminate)
</script>

<template>
  <span></span>
</template>
