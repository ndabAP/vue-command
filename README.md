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
    style="max-width: 550px;"
    title="neil@moon ~" 
    :commands="commands"
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
        if (args.color && args._[1] === 'pikachu') return 'yellow'

        return 'usage: pokedex pokemon [option]'
      }
    }
  })
}
</script>

```

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
