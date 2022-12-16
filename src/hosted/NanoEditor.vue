<template>
  <div
    v-show="terminal.isFullscreen"
    style="height: 100%">
    <textarea
      ref="nano"
      @keyup.ctrl.x.exact="exit">This is a nano text editor emulator! Press Ctrl + x to leave.</textarea>
  </div>
</template>

<script lang="js">
export default {
  inject: ['exit', 'setFullscreen', 'terminal'],

  created () {
    this.setFullscreen(true)
  },

  mounted () {
    this.$refs.nano.focus()
  }
}
</script>

<style scoped>
textarea {
  height: 100%;
}
</style>
