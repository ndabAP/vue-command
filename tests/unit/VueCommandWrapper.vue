<template>
  <VueCommand
    :commands="commands"
    :executed.sync="executed"
    :history.sync="history" />
</template>

<script>
import VueCommand from '../../src/library'

export default {
  components: {
    VueCommand
  },

  props: {
    commands: {
      default: () => ({}),
      type: Object
    }
  },

  data: () => ({
    executed: new Set(),
    history: []
  })
}
</script>
