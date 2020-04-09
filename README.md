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

## Usage

The following illustrates how to use this library to build a Nano editor available in many shells.

```vue
<template>
  <div v-if="environment.isExecuting">
    <textarea
      ref="nano"
      @keydown.ctrl.88="terminate">This is a text editor! Press Ctrl + X to leave.</textarea>
  </div>
</template>

<script>
export default {
  inject: ['setIsFullscreen', 'terminate'],

  mounted () {
    this.setIsFullscreen(true)
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

Now the command has to return the component. Additionally, we have to pass the terminals history
and executed commands.

```vue
<template>
  <vue-command 
    :commands="commands" 
    :executed.sync="executed"
    :history.sync="history"  />
</template>

<script>
import VueCommand from 'vue-command'
import 'vue-command/dist/vue-command.css'

import NanoEditor from './NanoEditor.vue'

export default {
  components: {
    VueCommand
  },

  data: () =>  ({
    commands: { 
      nano: () => NanoEditor 
    },
    
    executed: new Set(),
    history: []
  })
}
</script>
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

`commands` is an object containing key-value pairs where key is the command and the value is a function that will be called with the [yargs arguments](https://github.com/yargs/yargs-parser#readme). The function can return a `Promise` and must return or resolve a Vue.js component. To return strings or nothing use one of the convenient helper methods:

| Function                                                             | Description                                                                   |
|----------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `createStdout(content: String, isEscapeHtml: Boolean, name: String): Object` | Returns a Stdout component containing a span element with given inner content |
| `createStderr(content: String, isEscapeHtml: Boolean, name: String): Object` | Returns a Stderr component containing a span element with given inner content |
| `createDummyStdout(isInstance: Boolean): Object | DummyStdout`                             | Returns a dummy Stdout component to not show a Stdout                         |

If none of the helper methods is used, the command has to be manually terminated inside the component. Next to termination
it's possible to inject the following functions to manipulate the terminal:

| Function                                 | Description                                                 |
|------------------------------------------|-------------------------------------------------------------|
| `setCurrent(current: String)`            | Set the current `STDIN`                                     |
| `setCursor(cursor: Number)`              | Set cursor position                                         |
| `setIsFullscreen(isFullscreen: Boolean)` | Change the terminal into fullscreen mode                    |
| `setIsInProgress(isInProgress: Boolean)` | Change the if terminal is in progress                       |
| `terminate`                              | Executes common final tasks after command has been finished |

In your component you have access to a context and an environment variable. The environment variable contains these properties:

| Property                | Description                                        |
|-------------------------|----------------------------------------------------|
| `isExecuting: Boolean`  | Is the current component executing                 |
| `isFullscreen: Boolean` | Is the terminal in fullscreen mode                 |
| `isInProgress: Boolean` | Is any command active                              |

The context variable contains these properties:

| Property         | Description                        |
|------------------|------------------------------------|
| `cursor: Number` | Current cursor position at `STDIN` |
| `parsed: Object` | Parsed yargs arguments             |

### Built-in

`builtIn` is an object containing key-value pairs where key is the command and the value is a function that will be called with the [yargs arguments](https://github.com/yargs/yargs-parser#readme). The function can return a `Promise` and must return or resolve a Vue.js component. To return simple strings or nothing use one of the convenient helper methods listed [here](#commands).

In your component you have access to a context and an environment variable listed [here](#commands).

If none of the helper methods is used, the command has to be manually terminated inside the component. Next to termination
it's possible to inject functions to manipulate the terminal listed [here](#commands).

The difference to commands is the ability to manipulate when the component terminates.

## Slots

### Bar

It's possible to fully customize the terminal bar using slots as shown in the following. **Note**: If using the bar slot, the properties `hide-bar` and `title` will be ignored.

```vue
<template>
  <vue-command
    :commands="commands"
    :executed="new Set()"
    :history="[]">
    <div slot="bar">
      Pokedex
    </div>
  </vue-command>
</template>
```

## Events

| Event     | Type        | Description                       |
|-----------|-------------|-----------------------------------|
| `current` | `String`    | Emits the current input           |
| `execute` | `String`    | Emits when executing command      |
| `executed`| `String`    | Emits after command execution (only emitted when called `terminate`)    |

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
