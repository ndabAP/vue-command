<template>
  <div
    v-show="terminal.isFullscreen"
    style="height: 100%">
    <textarea
      ref="nano"
      @keyup.ctrl.x.exact="exit">This is a Nano text editor emulator! Press Ctrl + x to leave.</textarea>
  </div>
</template>

<script>
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

<style lang="scss" scoped>
textarea {
  height: 100%;
}
</style>
