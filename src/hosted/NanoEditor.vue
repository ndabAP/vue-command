<template>
  <div v-show="terminal.isFullscreen">
    <textarea
      ref="nano"
      @keyup.ctrl.x.exact="exit">This is a Nano text editor emulator! Press Ctrl + x to leave.</textarea>
  </div>
</template>

<script>
export default {
  inject: ['terminal', 'setFullscreen', 'exit'],

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
  background: none;
  border: none;
  outline: none;
  flex: 1;
  width: 100%;
  font-family: monospace;
  font-size: 1rem;
  resize: none;
  overflow: hidden;
  height: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
