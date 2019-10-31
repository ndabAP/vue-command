<template>
  <span v-html="stdout" />
</template>

<script>
export default {
  props: {
    stdout: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/mixins";
</style>
