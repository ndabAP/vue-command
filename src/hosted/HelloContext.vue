<template>
  <span>Hello {{ context.isRunning }}</span>
</template>

<script setup>
import { inject, onMounted } from 'vue'

// TODO: Add name

const terminate = inject('terminate')
const context = inject('context')

console.debug(terminate)
console.debug(context)

onMounted(() => setTimeout(() => terminate(), 1500))
</script>
