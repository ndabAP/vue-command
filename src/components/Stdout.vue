<template>
  <span
    :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"
    v-html="stdout">
  </span>
</template>

<script>
export default {
  props: {
    stdout: {
      type: String,
      default: ''
    },

    whiteTheme: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
  @import "../scss/mixins";
</style>
