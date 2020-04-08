<template>
  <VueCommand
    :built-in="builtIn"
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
    },

    builtIn: {
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