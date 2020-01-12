<template>
  <div v-if="$_isRunning">
    <textarea
      ref="nano"
      @keydown.ctrl.88="$_done()">This is a text editor! Press Ctrl + X to leave.</textarea>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$_setIsFullscreen(true)
    this.$refs.nano.focus()
  }
}
</script>

<style lang="scss" scoped>
div,
textarea {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
