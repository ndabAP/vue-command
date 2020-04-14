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

Let's start with a very simple example. We want to send "Hello world" to `Stdout`.

```vue
<template>
  <vue-command 
    :commands="commands" 
    :executed.sync="executed" />
</template>

<script>
import VueCommand, { createStdout } from 'vue-command'
import 'vue-command/dist/vue-command.css'

export default {
  data: () =>  ({
    executed: new Set(),
    commands: { 
      'hello-world': () => createStdout('Hello world') 
    }
  })
}
</script>
```

Now a more complex one. Let's assume we want to build the Nano editor available in many shells. 

We will use the provided `environment` variable to make sure the editor is only visible when this command is executing and inject a function called `terminate` to tell the terminal that the command has been finished when the user enters <kbd>Ctrl</kbd> + <kbd>X</kbd>. Furthermore, we inject the `setIsFullscreen` function to switch the terminal into fullscreen mode.

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

  created () {
    this.setIsFullscreen(true)
  },

  mounted () {
    this.$refs.nano.focus()
  }
}
</script>
```

Now the command has to return the component. Additionally, we have to pass a `Set` with the `sync` modifier which will contain all executed programs. This property can be changed at any time.

```vue
<template>
  <vue-command 
    :commands="commands" 
    :executed.sync="executed" />
</template>

<script>
import VueCommand from 'vue-command'
import 'vue-command/dist/vue-command.css'

import NanoEditor from '@/components/NanoEditor.vue'

export default {
  components: {
    VueCommand
  },

  data: () =>  ({
    executed: new Set(),
    commands: { 
      nano: () => NanoEditor 
    }
  })
}
</script>
```

## Properties

There are two types of commands: Built-in and regular ones. In most cases regular commands are appropriate. Built-in commands provide higher flexibility, see section [Built-in](#built-in) for more information. 

Some properties can be changed by the terminal, therefore, the `sync` modifier has to be added.

| Property                  | Type       | Default                  | Required | Sync | Description                                                                                               |
|---------------------------|------------|--------------------------|----------|------|-----------------------------------------------------------------------------------------------------------|
| `autocompletion-resolver` | `Function` | `null`                   | No       | No   | Gets the current input as first and cursor position as the second argument. Must return the whole command |
| `built-in`                | `Object`   | `{}`                     | No       | No   | See [Built-in](#built-in) section                                                                         |
| `commands`                | `Object`   |                          | Yes      | No   | See [Commands](#commands) section                                                                         |
| `cursor`                  | `Number`   | 0                        | No       | Yes  | Sets the `Stdin` cursor position                                                                          |
| `executed`                | `Set`      |                          | Yes      | Yes  | Executed programs                                                                                         |
| `help-text`               | `String`   | `Type help`              | No       | No   | Sets the placeholder                                                                                      |
| `help-timeout`            | `Number`   | `4000`                   | No       | No   | Sets the placeholder timeout                                                                              |
| `hide-bar`                | `Boolean`  | `false`                  | No       | No   | Hides the bar                                                                                             |
| `hide-prompt`             | `Boolean`  | `false`                  | No       | No   | Hides the prompt                                                                                          |
| `history`                 | `Array`    | `[]`                     | No       | Yes  | Executed commands                                                                                         |
| `intro`                   | `String`   | `Fasten your seatbelts!` | No       | No   | Sets the intro                                                                                            |
| `is-fullscreen`           | `Boolean`  | `false`                  | No       | Yes  | Sets the terminal fullscreen mode                                                                         |
| `is-in-progress`          | `Boolean`  | `false`                  | No       | Yes  | Sets the terminal progress status                                                                         |
| `not-found`               | `String`   | `not found`              | No       | No   | Sets the command not found text                                                                           |
| `pointer`                 | `Number`   | `0`                      | No       | Yes  | Sets the command pointer                                                                                  |
| `prompt`                  | `String`   | `~neil@moon:#`           | No       | No   | Sets the prompt                                                                                           |
| `show-help`               | `Boolean`  | `false`                  | No       | No   | Shows the placeholder                                                                                     |
| `show-intro`              | `Boolean`  | `false`                  | No       | No   | Shows the intro                                                                                           |
| `stdin`                   | `String`   | `''`                     | No       | Yes  | Sets the current `Stdin`                                                                                           |
| `title`                   | `String`   | `neil@moon: ~`           | No       | No   | Sets the title                                                                                            |
| `white-theme`             | `Boolean`  | `false`                  | No       | No   | Enables the white theme                                                                                   |
| `yargs-options`           | `Object`   | `{}`                     | No       | No   | Sets the [yargs options](https://github.com/yargs/yargs-parser#readme)                                    |

### Commands

`commands` must be an object containing key-value pairs where key is the command and the value is a function that will be called with the [yargs arguments](https://github.com/yargs/yargs-parser#readme). The function can return a `Promise` and must return or resolve a Vue.js component. To return strings or nothing use one of the convenient helper methods:

| Function                                                                                       | Description                                                                     |
|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `createStdout(content: String, isEscapeHtml: Boolean, name: String, ...mixins: Array): Object` | Returns a `Stdout` component containing a span element with given inner content |
| `createStderr(content: String, isEscapeHtml: Boolean, name: String, ...mixins: Array): Object` | Returns a `Stderr` component containing a span element with given inner content |
| `createDummyStdout(...mixins: Array): Object`                             | Returns a dummy `Stdout` to show a `Stdin`                                      |

Helper methods can be imported by name:

```js
import { createStdout, createStderr, createDummyStdout } from 'vue-command'
```

If none of the helper methods is used, the command has to be manually terminated inside the component. Next to termination it's possible to inject the following functions to manipulate the terminal or signal an event:

| Function                                 | Description                                                 |
|------------------------------------------|-------------------------------------------------------------|
| `emitExecute`                            | Emit command execution event                                |
| `emitExecuted`                           | Emit command executed event                                 |
| `emitInput(input: String)`               | Emit the current input                                      |
| `setCursor(cursor: Number)`              | Set cursor position                                         |
| `setIsFullscreen(isFullscreen: Boolean)` | Change if the terminal is in fullscreen mode                |
| `setIsInProgress(isInProgress: Boolean)` | Change if the terminal is in progress                       |
| `setPointer(pointer: Number)`            | Set command history pointer                                 |
| `setStdin(stdin: String)`                | Set the current `Stdin`                                     |
| `terminate`                              | Executes common final tasks after command has been finished |

Functions can be injected into your component by name:

```js
inject: ['setIsFullscreen', 'setIsInProgress', 'terminate']
```

In your component you have access to a `context` and an `environment` variable. The `environment` variable contains the following properties (note that built-in commands have to take care by theirselves about the terminals state):

| Property                | Description                                        |
|-------------------------|----------------------------------------------------|
| `isExecuting: Boolean`  | Is the current component executing                 |
| `isFullscreen: Boolean` | Is the terminal in fullscreen mode                 |
| `isInProgress: Boolean` | Is any command active                              |

The `context` variable contains the following properties:

| Property         | Description                        |
|------------------|------------------------------------|
| `cursor: Number` | Current cursor position at `Stdin` |
| `parsed: Object` | Parsed yargs arguments             |

### Built-in

Built-in commands provide more control over the terminals behaviour. On the other side, they have to take care about every regular command step. As a matter of fact, regular commands are just calling helper methods or change properties which could be also called or changed by built-in commands. Regular commands can be seen as a facade to built-in commands. 

The API is more likely to change. The argument that is called within the built-in command is the unparsed `Stdin`. It's possible to use a custom parser at this place.

To fully simulate a full command circle a built-in command has to follow these steps:

1. Add the programm to the `executed` `Set` property
2. Increase the history pointer
3. Emit command executing started
4. Tell terminal there is a command in progress  
5. Push the `Stdout` component into the `history` property
6. Execute actual task
7. Exit the command with the injected `terminate` function

## Slots

### Bar

It's possible to fully customize the terminal bar using slots as shown in the following. **Note**: If using the bar slot, the properties `hide-bar` and `title` will be ignored.

```vue
<template>
  <vue-command
    :commands="commands"
    :executed="executed">
    <div slot="bar">
      Pokedex
    </div>
  </vue-command>
</template>
```

## Events

| Event     | Type        | Description                       | Note
|-----------|-------------|-----------------------------------|-----------------------------------------------------|
| `input`   | `String`    | Emits the current input           |                                                     |
| `execute` | `String`    | Emits when executing command      | Built-in commands have to manually emit this event  |
| `executed`| `String`    | Emits after command execution     | Built-in commands have to manually emit this event. All helper methods emit this event  |

## Browser support

This library uses the `ResizeObserver` to track if the terminals inner height changes. You may need a pollyfill to support your target browser.

## Projects using vue-command

- [docker-management-dashboard](https://github.com/zero4994/docker-management-dashboard) - A management dashboard for your local docker containers
- [saber-theme-klieh](https://github.com/krmax44/saber-theme-klieh) - A Saber theme mimicking a terminal
- [ts-git](https://github.com/nfriend/ts-git) - A naïve implementation of git, written in TypeScript
- [curvy-idle-game](https://github.com/n4n0GH/curvy-idle-game) - Short idle game where you get to pat her

## Chuck Norris API

The Chuck Norris jokes are comming from [this](https://api.chucknorris.io/) API. This library has no relation to Chuck Norris or the services provided by the API.

## Author

[Julian Claus](https://www.julian-claus.de) and contributors. Special thanks to [krmax44](https://github.com/krmax44) for the amazing work!

## License

MIT
