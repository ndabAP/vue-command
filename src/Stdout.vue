<template>
  <span v-html="io"></span>
</template>

<script>
export default {
  name: 'Stdout',
  props: {
    io: {
      type: String,
      default: ''
    }
  }
}
</script>
