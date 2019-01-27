# vue-command

A fully working Vue.js terminal emulator.

## Features

- Parse arguments with [yargs-parser](https://www.npmjs.com/package/yargs-parser)
- Search history
- Highly customizable

## Installation

```bash
$ npm i vue-command
```

## Usage

```vue
<template>
  <vue-command
    help
    :yargs-options="{ alias: { color: ['colour'] } }"
    :commands="commands"
    title="neil@moon ~" 
    style="max-width: 550px;"
    place-holder-text="Type help and enter"
  />
</template>

<script>
import VueCommand from 'vue-command'
import 'vue-command/dist/vue-command.css'

export default {
  components: {
    VueCommand
  },

  data: () => ({
    commands: {
      pokedex: args => {
        if (args.color && args._[1] === 'pikachu') return 'yellow'

        return `Usage: pokedex pokemon [option]<br><br>

        Example: pokedex pikachu --color
        `
      }
    }
  })
}
</script>

<style>
  #term {
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;

    .cont {
      min-height: 300px;
    }
  }
</style>
```

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
