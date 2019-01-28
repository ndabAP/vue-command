<template>
  <span v-html="io" :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"></span>
</template>

<script>
export default {
  name: 'Stdout',

  props: {
    io: {
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
