<template>
  <span v-html="stdout" :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"></span>
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
  @import './scss/mixins';
</style>
