<template>
  <vue-command style="max-width: 550px;" title="neil@moon ~" :commands="commands"/>
</template>

<script>
import VueCommand from './VueCommand'

export default {
  components: {
    VueCommand
  },

  data: () => ({
    commands: {
      'pokedex': args => {
        if (args.color) return 'yellow'
      }
    }
  })
}
</script>
