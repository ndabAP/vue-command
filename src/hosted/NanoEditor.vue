<template>
  <div v-if="$running">
    <textarea ref="editor" @keydown.ctrl.88="$done()">This is a text editor! Press Ctrl + X to leave.</textarea>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$goFullscreen()
    this.$refs.editor.focus()
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
