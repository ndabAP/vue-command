<template>
  <span>Hello</span>
</template>

<script setup>
import { inject, onMounted } from 'vue'

// TODO: Add name

const exit = inject('exit')
// const context = inject('context')

onMounted(exit)
</script>
