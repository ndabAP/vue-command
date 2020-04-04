# vue-command

A fully working, most feature-rich Vue.js terminal emulator. See the [demo](https://ndabap.github.io/vue-command/).

## Features

- Parse arguments with [yargs-parser](https://www.npmjs.com/package/yargs-parser)
- Search history (with <kbd>↑</kbd>/<kbd>↓</kbd>)
- White/Dark theme support
- Autocompletion resolver (with <kbd>↹</kbd>)
- Supports asynchronous commands
- Customize terminal with slots

## Installation

```bash
$ npm i vue-command --save
```

## Properties

| Property                  | Type       | Default                  | Required | Description                                                                                                                                                                                                                       |
| ------------------------- | ---------- | ------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autocompletion-resolver` | `Function` | `null`                   | No       | Gets the current input as first and cursor position as the second argument. Must return the whole command                                                                                                                         |
| `built-in`                | `Object`   | `{}`                     | No       | See [built-in](#built-in) section |
| `commands`                | `Object`   |                          | Yes      | See [commands](#commands) section                                                                                                                                                                                           |
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


### Commands

`commands` is an object containing key-value pairs where key is the command and the value is a function that will be called with the [yargs arguments](https://github.com/yargs/yargs-parser#readme). The function can return a `Promise` resolving to a HTML `String`, that will be used as the output or a Vue.js component, which you can use for more complex functions. 

In your component, you have access to the following instance properties:

| Name                                            | Type       | Property | Description                                                                                                                                                                           |
|-------------------------------------------------|------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `this.$_arguments`                              | `Object`   | Computed | Parsed [yargs arguments](https://github.com/yargs/yargs-parser#readme)                                                                                                                |
| `this.$_done`                                   | `Function` | Method   | Once your command is finished, call `this.$_done()` to allow the user to enter a new command. Make sure your component doesn't change from this point on. Also leaves fullscreen mode |
| `this.$_executeCommand(command: String)`        | `Function` | Method   | After executing `this.$_done()`, you can use this method to run a subsequent command                                                                                                  |
| `this.$_isRunning`                              | `Boolean`  | Computed | Indicates whether your command is still running or if it has terminated                                                                                                               |
| `this.$_setIsFullscreen(isFullscreen: Boolean)` | `Function` | Method   | Toggle if your command will be the only visible element in the shell                                                                                                                  |
### Built-in

Key-value pairs where key is command and value is function with [yargs arguments](https://github.com/yargs/yargs-parser#readme) and `$data` from instance. Function should return `String` or `Promise` that resolves to `String`.

## Events

| Event     | Type        | Description                       |
|-----------|-------------|-----------------------------------|
| `current` | `String`    | Emits the current input           |
| `execute` | `String`    | Emits the whole executing command |
| `executed`| `String`    | Emits after command execution     |

## Slots

### Bar

It's possible to fully customize the terminal bar using slots as shown in the following. **Note**: If using the bar slot, the properties `hide-bar` and `title` will be ignored.

```vue
<template>
  <vue-command
    :commands="commands">
    <div slot="bar">
      Pokedex
    </div>
  </vue-command>
</template>
```

## Usage

You can either return a `String` or a Vue.js component.

### String

Returns the color of the Pokémon "Pikachu".

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

### Component

Simulates the Nano editor available in many shells.

```vue
<template>
  <div v-if="$_isRunning">
    <textarea 
      ref="nano" 
      @keydown.ctrl.88="$_done()">
      This is a text editor! Press Ctrl + X to leave.
    </textarea>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$_setIsFullscreen(true)
    this.$refs.nano.focus()
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

Now the command has to return the component.

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

  data: () =>  ({
    commands: { 
      nano: () => nano 
    }
  })
}
</script>
```

## Browser support

This library uses the `ResizeObserver` to track if the terminals inner height changes. You may need a pollyfill to support your target browser.

## Projects using vue-command

- [docker-management-dashboard](https://github.com/zero4994/docker-management-dashboard) - A management dashboard for your local docker containers
- [saber-theme-klieh](https://github.com/krmax44/saber-theme-klieh) - A Saber theme mimicking a terminal
- [ts-git](https://github.com/nfriend/ts-git) - A naïve implementation of git, written in TypeScript
- [curvy-idle-game](https://github.com/n4n0GH/curvy-idle-game) - Short idle game where you get to pat her

## Author

[Julian Claus](https://www.julian-claus.de) and contributors. Special thanks to [krmax44](https://github.com/krmax44) for the amazing work!

## License

MIT
