<template>
  <span v-if="false">
    Options: <br>
    &nbsp;--timeout (default: 50)<br>
    &nbsp;--amount (default: 10)
  </span>
  <span v-else>{{ "#".repeat(index) }}</span>
</template>

<script>
import { parse } from 'path'
import { inject, onMounted } from 'vue'

export default {
  inject: ['exit'],

  setup () {
    const context = inject('context')
    console.log(context)

    onMounted(() => {

    })
  },

  data: () => ({
    index: 0
  }),

  mounted () {
    this.exit()
    // const parsedQuery = this.context.parsedQuery
    // // if (parsedQuery.help) {
    // //   this.exit()

    // //   return
    // // }

    // const timeout = parsedQuery.timeout || 50
    // const amount = parsedQuery.amount || 10

    // console.log(this.context)

    // const load = () =>
    //   setTimeout(() => {
    //     this.index++
    //     if (this.index < amount) {
    //       load()
    //     } else {
    //       this.exit()
    //     }
    //   }, timeout)

    // load()
  }
}
</script>
