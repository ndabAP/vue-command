<template>
  <vue-command
    style="max-width: 550px;"
    title="neil@moon ~" :commands="commands"
    :styles="{ border: '0', maxHeight: '150px' }"
    help
  />
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
        if (args.color && args._[1] === 'pickachu') return 'yellow'

        return 'usage: pokedex pokemon [option]'
      }
    }
  })
}
</script>
