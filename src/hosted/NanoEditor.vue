<template>
  <div v-if="!done">
    <textarea ref="editor" @keydown.ctrl.88="finish">This is a text editor! Press Ctrl + X to leave.</textarea>
  </div>
</template>

<script>
export default {
  data () {
    return { done: false }
  },
  mounted () {
    this.$goFullscreen()
    this.$refs.editor.focus()
  },
  methods: {
    finish () {
      this.done = true
      this.$done()
    }
  }
}
</script>

<style lang="scss" scoped>
div, textarea {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
