<template>
  <span v-if="$_arguments.help">
    Options: <br>
    --timeout (default: 50)<br>
    --amount (default: 10)
  </span>
  <span v-else>{{ "#".repeat(index) }}</span>
</template>

<script>
export default {
  data: () => ({
    index: 0
  }),

  mounted () {
    if (this.$_arguments.help) return this.$_done()

    const timeout = this.$_arguments.timeout || 50
    const amount = this.$_arguments.amount || 10

    const load = () =>
      setTimeout(() => {
        this.index++
        if (this.index < amount) {
          load()
        } else {
          // Given by vue-command, marks the process as done and allows the user to enter a new command
          this.$_done()
        }
      }, timeout)

    load()
  }
}
</script>
