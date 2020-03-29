<template>
  <div v-show="environment.isExecuting">
    <textarea
      ref="nano"
      @keydown.ctrl.88="terminate">This is a text editor! Press Ctrl + X to leave.</textarea>
  </div>
</template>

<script>
export default {
  inject: ['setIsFullscreen', 'terminate'],

  mounted () {
    this.setIsFullscreen(true)
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
