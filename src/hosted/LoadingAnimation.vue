<template>
  <span v-if="context.parsed.help">
    Options: <br>
    &nbsp;--timeout (default: 50)<br>
    &nbsp;--amount (default: 10)
  </span>
  <span v-else>{{ "#".repeat(index) }}</span>
</template>

<script>
export default {
  inject: ['terminate'],

  data: () => ({
    index: 0
  }),

  mounted () {
    if (this.context.parsed.help) {
      return this.terminate()
    }

    const timeout = this.context.parsed.timeout || 50
    const amount = this.context.parsed.amount || 10

    const load = () =>
      setTimeout(() => {
        this.index++
        if (this.index < amount) {
          load()
        } else {
          // Provided by vue-command, marks the process as done and allows the user to enter a new command
          this.terminate()
        }
      }, timeout)

    load()
  }
}
</script>
