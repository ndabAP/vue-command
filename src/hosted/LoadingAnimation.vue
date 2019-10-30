<template>
  <span>{{ "#".repeat(i) }}</span>
</template>

<script>
export default {
  data () {
    return { i: 0 }
  },
  mounted () {
    const load = () =>
      setTimeout(() => {
        this.i++
        if (this.i < 10) {
          load()
        } else {
          // given by vue-command, marks the process as done and allows the user to enter a new command
          this.$done()
        }
      }, 50)

    load()
  }
}
</script>
