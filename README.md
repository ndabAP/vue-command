# vue-command

A fully working, most feature-rich Vue.js terminal emulator. See the [demo](https://ndabap.github.io/vue-command/).

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
| `commands`                | `Object`   |                          | Yes      | See Commands below.                           |
| `help-text`               | `String`   | `Type help`              | No       | Sets the placeholder                                                                                                                                                                                                              |
| `help-timeout`            | `Number`   | `4000`                   | No       | Sets the placeholder timeout                                                                                                                                                                                                      |
| `hide-bar`                | `Boolean`  | `false`                  | No       | Hides the bar                                                                                                                                                                                                                     |
| `hide-prompt`             | `Boolean`  | `false`                  | No       | Hides the prompt                                                                                                                                                                                                                  |
| `intro`                   | `String`   | `Fasten your seatbelts!` | No       | Sets the intro                                                                                                                                                                                                                    |
| `not-found`               | `String`   | `not found`              | No       | Sets the command not found text                                                                                                                                                                                                   |
| `prompt`                  | `String`   | `~neil@moon:#`           | No       | Sets the prompt                                                                                                                                                                                                                   |
| `show-help`               | `Boolean`  | `false`                  | No       | Shows the placeholder                                                                                                                                                                                                             |
| `show-intro`              | `Boolean`  | `false`                  | No       | Shows the intro                                                                                                                                                                                                                   |
| `title`                   | `String`   | `neil@moon: ~`           | No       | Sets the title                                                                                                                                                                                                                    |
| `white-theme`             | `Boolean`  | `false`                  | No       | Enables the white theme                                                                                                                                                                                                           |
| `yargs-options`           | `Object`   | `{}`                     | No       | Sets the [yargs options](https://github.com/yargs/yargs-parser#readme)                                                                                                                                                            |


## Commands

`commands` is an object containing key-value pairs where key is the command and the value is an (async) function that will be called with the [yargs arguments](https://github.com/yargs/yargs-parser#readme) as an argument. It can return either an HTML string, that will be used as the output or a Vue component which you can use for more complex functions. In your component, you will have access to the following methods and computed properties:

| Name | Type | Description |
| --- | --- | --- |
| `this.$arguments` | `Object` | Parsed [yargs arguments](https://github.com/yargs/yargs-parser#readme). |
| `this.$done()` | `Function` | Once your command is finished, call `this.$done()` to allow the user to enter a new command. Make sure your component doesn't change any further from this point on. **Make sure to eventually call this method.** Also leaves fullscreen mode. |
| `this.$running` | `Boolean` | Indicates whether your command is still running or if it has terminated. |
| `this.$executeCommand(command: string)` | `Function` | After executing `this.$done()`, you can use this method to run a subsequent command. |
| `this.$goFullscreen()` | `Function` | Your command will be the only visible element in the shell. |
| `this.$leaveFullscreen()` | `Function` | Leaves fullscreen mode. |


## Events

| Event     | Type        | Description                       |
|-----------|-------------|-----------------------------------|
| `input`   | `String`    | Emits the current input           |
| `execute` | `String`    | Emits the whole executing command |
| `executed`| `String`    | Emits after command execution     |

## Usage

### Function

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

## Component

### NanoEditor.vue

```vue
<template>
  <!-- this will hide the editor from the shell history -->
  <div v-if="$running">
    <textarea ref="editor" @keydown.ctrl.88="$done()">This is a text editor! Press Ctrl + X to leave.</textarea>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$goFullscreen()
    this.$refs.editor.focus()
  }
}
</script>

<style lang="scss" scoped>
div,
textarea {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
```

### App.vue

```vue
<template>
  <vue-command :commands="commands" />
</template>

<script>
import VueCommand from 'vue-command'
import 'vue-command/dist/vue-command.css'
import nano from './NanoEditor.vue'

export default {
  components: {
    VueCommand
  },
  data() {
    return {
      commands: { nano: () => nano }
    }
  }
}
</script>
```

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
