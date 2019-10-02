# vue-command

A fully working Vue.js terminal emulator. See the [demo](https://ndabap.github.io/vue-command/).

## Features

- Parse arguments with [yargs-parser](https://www.npmjs.com/package/yargs-parser)
- Search history (with <kbd>↑</kbd>/<kbd>↓</kbd>)
- White/Dark theme support
- Autocompletion resolver (with <kbd>↹</kbd>)
- Supports asynchronous commands

## Installation

```bash
$ npm i vue-command --save
```

## Properties

| Property                  | Type       | Default                  | Required | Description                                                                                                                                                                                                                       |
|---------------------------|------------|--------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `autocompletion-resolver` | `Function` | `null`                   | No       | Gets the current input as first and cursor position as the second argument. Must return the whole command                                                                                                                         |
| `built-in`                | `Object`   | `{}`                     | No       | Key-value pairs where key is command and value is function with [yargs arguments](https://github.com/yargs/yargs-parser#readme) and `$data` from instance. Function should return `String` or `Promise` that resolves to `String` |
| `commands`                | `Object`   |                          | Yes      | Key-value pairs where key is command and value is function with [yargs arguments](https://github.com/yargs/yargs-parser#readme). Function should return `String` or `Promise` that resolves to `String`                           |
| `help-text`               | `String`   | `Type help`              | No       | Sets the placeholder                                                                                                                                                                                                              |
| `help-timeout`            | `Number`   | `4000`                   | No       | Sets the placeholder timeout                                                                                                                                                                                                      |
| `hide-bar`                | `Boolean`  | `false`                  | No       | Hides the bar                                                                                                                                                                                                                     |
| `hide-prompt`             | `Boolean`  | `false`                  | No       | Hides the prompt                                                                                                                                                                                                                  |
| `intro`                   | `String`   | `Fasten your seatbelts!` | No       | Sets the intro                                                                                                                                                                                                                    |
| `keep-prompt`             | `Boolean`  | `false`                  | No       | Keeps the prompt for already executed commands                                                                                                                                                                                    |
| `not-found`               | `String`   | `not found`              | No       | Sets the command not found text                                                                                                                                                                                                   |
| `prompt`                  | `String`   | `~neil@moon:#`           | No       | Sets the prompt                                                                                                                                                                                                                   |
| `show-help`               | `Boolean`  | `false`                  | No       | Shows the placeholder                                                                                                                                                                                                             |
| `show-intro`              | `Boolean`  | `false`                  | No       | Shows the intro                                                                                                                                                                                                                   |
| `title`                   | `String`   | `neil@moon: ~`           | No       | Sets the title                                                                                                                                                                                                                    |
| `white-theme`             | `Boolean`  | `false`                  | No       | Enables the white theme                                                                                                                                                                                                           |
| `yargs-options`           | `Object`   | `{}`                     | No       | Sets the [yargs options](https://github.com/yargs/yargs-parser#readme)                                                                                                                                                            |


## Events

| Event     | Type        | Description                       |
|-----------|-------------|-----------------------------------|
| `input`   | `String`    | Emits the current input           |
| `execute` | `String`    | Emits the whole executing command |
| `executed`| `String`    | Emits after command execution     |

## Usage

```vue
<template>
  <vue-command
    :yargs-options="{ alias: { color: ['colour'] } }"
    :commands="commands"
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
      // yargs arguments
      pokedex: ({ color, _ }) => {
        if (color && _[1] === 'pikachu') {
          return 'yellow'
        }
        
        // Return help since no match
        return `Usage: pokedex pokemon [option]<br><br>

        Example: pokedex pikachu --color
        `
      }
    }
  })
}
</script>

<style lang="scss">
  .vue-command {
    .term {
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      border-radius: 8px;
    }

    .term-std {
      min-height: 300px;
      max-height: 300px;
      overflow-y: scroll;
    }
  }
</style>
```

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
