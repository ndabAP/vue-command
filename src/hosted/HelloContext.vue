<template>
  <span>Hello {{ context.stdin }}</span>
</template>

<script>
import { inject, onMounted } from 'vue'

export default {
  setup () {
    const terminate = inject('terminate')

    onMounted(terminate)
  }
}
</script>
