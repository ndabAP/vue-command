<template>
  <span v-if="$arguments.help">
    Options: <br>
    --timeout (default: 50)<br>
    --amount (default: 10)
  </span>
  <span v-else>{{ "#".repeat(i) }}</span>
</template>

<script>
export default {
  data () {
    return { i: 0 }
  },
  mounted () {
    if (this.$arguments.help) return this.$done()

    const timeout = this.$arguments.timeout || 50
    const amount = this.$arguments.amount || 10

    const load = () =>
      setTimeout(() => {
        this.i++
        if (this.i < amount) {
          load()
        } else {
          // given by vue-command, marks the process as done and allows the user to enter a new command
          this.$done()
        }
      }, timeout)

    load()
  }
}
</script>
