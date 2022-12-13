<template>
  <div v-if="context.isFullscreen.value">
    <textarea
      ref="nano"
      rows="15"
      @keyup.ctrl.x.exact="exit">This is a Nano text editor emulator! Press Ctrl + x to leave.</textarea>
  </div>
</template>

<script>
export default {
  inject: ['context', 'setFullscreen', 'exit'],

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

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
