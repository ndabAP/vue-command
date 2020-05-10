<template>
  <div v-if="environment.isExecuting">
    <textarea
      ref="nano"
      rows="15"
      @keydown.ctrl.88="terminate">This is a Nano text editor emulator! Press Ctrl + x to leave.</textarea>
  </div>
</template>

<script>
export default {
  inject: ['setIsFullscreen', 'terminate'],

  created () {
    this.setIsFullscreen(true)
  },

  mounted () {
    this.$refs.nano.focus()
  }
}
</script>

<style lang="scss" scoped>
textarea {
  display: block;
  width: 100%;
  height: 100%;
  resize: none;
  overflow: hidden;
}
</style>
