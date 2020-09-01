# vue-command

A fully working, most feature-rich Vue.js terminal emulator. See the [demo](https://ndabap.github.io/vue-command/) and check the demo [source code](https://github.com/ndabAP/vue-command/blob/master/src/hosted/App.vue).

## Features

- Parses arguments with [`getopts`](https://www.npmjs.com/package/getopts)
- Supports asynchronous commands
- Browse history (with <kbd>↑</kbd>/<kbd>↓</kbd>)
- Autocompletion resolver (with <kbd>↹</kbd>)
- Customize terminal with slots
- Search history (with <kbd>Ctrl</kbd> + <kbd>r</kbd>)

## Installation

```bash
$ npm install vue-command --save
```

## Usage

Let's start with a very simple example. We want to send "Hello world" to `Stdout` when entering `hello-world`.

```vue
<template>
  <vue-command :commands="commands" />
</template>

<script>
import VueCommand, { createStdout } from 'vue-command'
import 'vue-command/dist/vue-command.css'

export default {
  components: {
    VueCommand
  },

  data: () =>  ({
    commands: { 
      'hello-world': () => createStdout('Hello world') 
    }
  })
}
</script>
```

Now a more complex one. Let's assume we want to build the Nano editor available in many shells. 

We will use the provided `environment` variable to make sure the editor is only visible when this command is executing and inject a function called `terminate` to tell the terminal that the command has been finished when the user enters <kbd>Ctrl</kbd> + <kbd>x</kbd>. Furthermore, we inject the `setIsFullscreen` function to switch the terminal into fullscreen mode.

```vue
<template>
  <div v-if="environment.isExecuting">
    <textarea
      ref="nano"
      @keydown.ctrl.88="terminate">This is a text editor! Press Ctrl + x to leave.</textarea>
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

Now the command has to return the component.

```vue
<template>
  <vue-command :commands="commands" />
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

| Property                  | Type       | Default                                                                           | Sync | Description                                                                                  |
|---------------------------|------------|-----------------------------------------------------------------------------------|------|----------------------------------------------------------------------------------------------|
| `autocompletion-resolver` | `Function` | `null`                                                                            | No   | See [Autocompletion resolver](#autocompletion-resolver)                                      |
| `built-in`                | `Object`   | `{}`                                                                              | No   | See [Built-in](#built-in) section                                                            |
| `commands`                | `Object`   | `{}`                                                                              | No   | See [Commands](#commands) section                                                            |
| `cursor`                  | `Number`   | `0`                                                                               | Yes  | Sets the `Stdin` cursor position                                                             |
| `event-listeners`         | `Array`    | `[EVENT_LISTENERS.autocomplete, EVENT_LISTENERS.history, EVENT_LISTENERS.search]` | No   | See [Event listeners](#event-listeners) section                                              |
| `executed`                | `Set`      | `new Set()`                                                                       | Yes  | Executed programs, see ["Overwriting `executed` functions"](#overwriting-executed-functions) |
| `help-text`               | `String`   | `Type help`                                                                       | No   | Sets the placeholder                                                                         |
| `help-timeout`            | `Number`   | `4000`                                                                            | No   | Sets the placeholder timeout                                                                 |
| `hide-bar`                | `Boolean`  | `false`                                                                           | No   | Hides the bar                                                                                |
| `hide-prompt`             | `Boolean`  | `false`                                                                           | No   | Hides the prompt                                                                             |
| `hide-title`              | `Boolean`  | `false`                                                                           | No   | Hides the title                                                                              |
| `history`                 | `Array`    | `[]`                                                                              | Yes  | Executed commands                                                                            |
| `intro`                   | `String`   | `Fasten your seatbelts!`                                                          | No   | Sets the intro                                                                               |
| `is-fullscreen`           | `Boolean`  | `false`                                                                           | Yes  | Sets the terminal fullscreen mode                                                            |
| `is-in-progress`          | `Boolean`  | `false`                                                                           | Yes  | Sets the terminal progress status                                                            |
| `not-found`               | `String`   | `not found`                                                                       | No   | Sets the command not found text                                                              |
| `parser-options`          | `Object`   | `{}`                                                                              | No   | Sets the [parser options](https://github.com/jorgebucaran/getopts#api)                       |
| `pointer`                 | `Number`   | `0`                                                                               | Yes  | Sets the command pointer                                                                     |
| `prompt`                  | `String`   | `~neil@moon:#`                                                                    | No   | Sets the prompt                                                                              |
| `show-help`               | `Boolean`  | `false`                                                                           | No   | Shows the placeholder                                                                        |
| `show-intro`              | `Boolean`  | `false`                                                                           | No   | Shows the intro                                                                              |
| `stdin`                   | `String`   | `''`                                                                              | Yes  | Sets the current `Stdin`                                                                     |
| `title`                   | `String`   | `neil@moon: ~`                                                                    | No   | Sets the title                                                                               |

### Commands

`commands` must be an object containing key-value pairs where key is the command and the value is a function that will be called with the [`getops` arguments](https://www.npmjs.com/package/getopts). The function can return a `Promise` and must return or resolve a Vue.js component. To return strings or nothing use one of the convenient helper methods:

| Function                                                                                                             | Description                                                                     |
|----------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `createStdout(content: String, isInnerText: Boolean, isEscapeHtml: Boolean, name: String, ...mixins: Array): Object` | Returns a `Stdout` component containing a span element with given inner content |
| `createStderr(content: String, isEscapeHtml: Boolean, name: String, ...mixins: Array): Object`                       | Returns a `Stderr` component containing a span element with given inner content |
| `createDummyStdout(name: String, ...mixins: Array): Object`                                                          | Returns a dummy `Stdout` to show a `Stdin`                                      |

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
| `cursor: Number` | Copy of cursor position at `Stdin` |
| `executed: Set`  | Copy of executed programs          |
| `history: Array` | Copy of executed commands          |
| `parsed: Object` | Parsed `getops` arguments          |
| `pointer: Number`| Copy of history command pointer    |
| `stdin: String`  | Copy of `Stdin`                    | 

### Built-in

Built-in commands provide more control over the terminals behaviour. On the other side, they have to take care about every regular command step. As a matter of fact, regular commands are just calling helper methods or change properties which could be also called or changed by built-in commands. Regular commands can be seen as a facade to built-in commands.

Since built-in commands can capture any command, it's necessary to take care of autocompletion and the command not found experience.

The first argument that is called within the built-in command is the unparsed `Stdin`. It's possible to use a custom parser at this place. The second argument is the terminal instance. You can use the `commandNotFound` method if no built-in or regular command has been found.

To fully simulate a regular command circle a built-in command has to follow these steps:

1. Call `setIsInProgress` with `true` to tell there is a command in progress
2. Add the programm to the `executed` `Set` property
3. Increase the history pointer with `setPointer`
4. Execute actual task
5. Push the `Stdout` component into the `history` property
6. Call `setIsInProgress` with `false` to tell there is no command in progress anymore

### Autocompletion resolver

It is possible to provide a function that is called when the user hits the <kbd>↹</kbd> key. This function needs to take care of the autocompletion experience and should make usage of properties like `history` and `stdin`. The following shows a possible, simple autocompletion function:

```js
this.autocompletionResolver = () => {
  // Make sure only programs are autocompleted. See below for version with options
  const command = this.stdin.split(' ')
  if (command.length > 1) {
    return
  }

  const autocompleteableProgram = command[0]
  // Collect all autocompletion candidates
  let candidates = []
  const programs = [...Object.keys(this.commands)].sort()
  programs.forEach(program => {
    if (program.startsWith(autocompleteableProgram)) {
      candidates.push(program)
    }
  })

  // Autocompletion resolved into multiple results
  if (this.stdin !== '' && candidates.length > 1) {
    this.history.push({
      // Build table programmatically
      render: createElement => {
        const columns = candidates.length < 5 ? candidates.length : 4
        const rows = candidates.length < 5 ? 1 : Math.ceil(candidates.length / columns)

        let index = 0
        let table = []
        for (let i = 0; i < rows; i++) {
          let row = []
          for (let j = 0; j < columns; j++) {
            row.push(createElement('td', candidates[index]))
            index++
          }

          table.push(createElement('tr', [row]))
        }

        return createElement('table', { style: { width: '100%' } }, [table])
      }
    })
  }

  // Autocompletion resolved into one result
  if (candidates.length === 1) {
    this.stdin = candidates[0]
  }
}
```

<details>
  <summary>Advanced version with option autocompletion</summary>
  
  ```js
  this.autocompletionResolver = () => {
    // Preserve cursor position
    const cursor = this.cursor

    // Reverse concatenate autocompletable according to cursor
    let pointer = this.cursor
    let autocompleteableStdin = ''
    while (this.stdin[pointer - 1] !== ' ' && pointer - 1 > 0) {
      pointer--
      autocompleteableStdin = `${this.stdin[pointer]}${autocompleteableStdin}`
    }

    // Divide by arguments
    const command = this.stdin.split(' ')

    // Autocompleteable is program
    if (command.length === 1) {
      const autocompleteableProgram = command[0]
      // Collect all autocompletion candidates
      const candidates = []
      const programs = [...Object.keys(this.commands)].sort()
      programs.forEach(program => {
        if (program.startsWith(autocompleteableProgram)) {
          candidates.push(program)
        }
      })

      // Autocompletion resolved into multiple results
      if (this.stdin !== '' && candidates.length > 1) {
        this.history.push({
          // Build table programmatically
          render: createElement => {
            const columns = candidates.length < 5 ? candidates.length : 4
            const rows = candidates.length < 5 ? 1 : Math.ceil(candidates.length / columns)

            let index = 0
            const table = []
            for (let i = 0; i < rows; i++) {
              const row = []
              for (let j = 0; j < columns; j++) {
                row.push(createElement('td', candidates[index]))
                index++
              }

              table.push(createElement('tr', [row]))
            }

            return createElement('table', { style: { width: '100%' } }, [table])
          }
        })
      }

      // Autocompletion resolved into one result
      if (candidates.length === 1) {
        // Mutating Stdin mutates the cursor, so we've to wait to push it to the end
        const unwatch = this.$watch(() => this.cursor, () => {
          this.cursor = cursor + (candidates[0].length - autocompleteableStdin.length + 0)

          unwatch()
        })

        this.stdin = candidates[0]
      }

      return
    }

    // Check if option might be completed already or option is last tokens
    if ((this.stdin[cursor] !== '' && this.stdin[cursor] !== ' ') && typeof this.stdin[cursor] !== 'undefined') {
      return
    }

    // Get the executable
    const program = command[0]

    // Check if any autocompleteable exists
    if (typeof this.options.long[program] === 'undefined' && typeof this.options.short[program] === 'undefined') {
      return
    }

    // Autocompleteable is long option
    if (autocompleteableStdin.substring(0, 2) === '--') {
      const candidates = []
      this.options.long[program].forEach(option => {
        // If only dashes are present, user requests all options
        if (`--${option}`.startsWith(autocompleteableStdin) || autocompleteableStdin === '--') {
          candidates.push(option)
        }
      })

      // Autocompletion resolved into one result
      if (candidates.length === 1) {
        const autocompleted = `${this.stdin.substring(0, pointer - 1)} --${candidates[0]}`
        const rest = `${this.stdin.substring(this.cursor)}`

        // Mutating Stdin mutates the cursor, so we've to wait to push it to the end
        const unwatch = this.$watch(() => this.cursor, () => {
          this.cursor = cursor + (candidates[0].length - autocompleteableStdin.length + 2)

          unwatch()
        })

        this.stdin = `${autocompleted}${rest}`

        return
      }

      // Autocompletion resolved into multiple result
      if (autocompleteableStdin === '--' || candidates.length > 1) {
        this.history.push({
          // Build table programmatically
          render: createElement => {
            const columns = candidates.length < 5 ? candidates.length : 4
            const rows = candidates.length < 5 ? 1 : Math.ceil(candidates.length / columns)

            let index = 0
            const table = []
            for (let i = 0; i < rows; i++) {
              const row = []
              for (let j = 0; j < columns; j++) {
                row.push(createElement('td', `--${candidates[index]}`))
                index++
              }

              table.push(createElement('tr', [row]))
            }

            return createElement('table', { style: { width: '100%' } }, [table])
          }
        })
      }

      return
    }

    // Autocompleteable is option
    if (autocompleteableStdin.substring(0, 1) === '-') {
      const candidates = []
      this.options.short[program].forEach(option => {
        // If only one dash is present, user requests all options
        if (`-${option}`.startsWith(autocompleteableStdin) || autocompleteableStdin === '-') {
          candidates.push(option)
        }
      })

      // Autocompletion resolved into one result
      if (candidates.length === 1) {
        const autocompleted = `${this.stdin.substring(0, pointer - 1)} -${candidates[0]}`
        const rest = `${this.stdin.substring(this.cursor)}`

        // Mutating Stdin mutates the cursor, so we've to wait to push it to the end
        const unwatch = this.$watch(() => this.cursor, () => {
          this.cursor = cursor + (candidates[0].length - autocompleteableStdin.length + 1)

          unwatch()
        })

        this.stdin = `${autocompleted}${rest}`

        return
      }

      // Autocompletion resolved into multiple result
      if (autocompleteableStdin === '-' || candidates.length > 1) {
        this.history.push({
          // Build table programmatically
          render: createElement => {
            const columns = candidates.length < 5 ? candidates.length : 4
            const rows = candidates.length < 5 ? 1 : Math.ceil(candidates.length / columns)

            let index = 0
            const table = []
            for (let i = 0; i < rows; i++) {
              const row = []
              for (let j = 0; j < columns; j++) {
                row.push(createElement('td', `-${candidates[index]}`))
                index++
              }

              table.push(createElement('tr', [row]))
            }

            return createElement('table', { style: { width: '100%' } }, [table])
          }
        })
      }
    }
  }
  ```
</details>

### Event listeners

Event listeners trigger terminal behaviour under certain conditions like pressing a button. Pass an array of event listeners you want to bind via the `event-listeners` property. This library provides three event listeners per default which can be imported:

- **Autocompletion**: Autocompletion when pressing "Tab" key
- **History**: Cycle through history with "Arrow up key" and "Arrow down key"
- **Search**: Search history with "Ctrl" and "r"

An event listener is called with the Vue.js component instance as argument. 

## Slots

### Bar

It's possible to fully customize the terminal bar using slots as shown in the following. **Note**: If using the bar slot, the properties `hide-bar` and `title` will be ignored.

```vue
<template>
  <vue-command>
    <div slot="bar">
      Pokedex
    </div>
  </vue-command>
</template>
```

### Prompt

Customize the prompt with the `prompt` slot. **Note**: If using the prompt slot, the property `prompt` will be ignored and the CSS class `term-ps` has to be manually applied.

```vue
<template>
  <vue-command prompt="neil">
    <span
      class="term-ps" 
      slot="prompt">
      {{ prompt }} ready to take off:
    </span>
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

## Overwriting `executed` functions

To track when the `executed` property has been mutated, this library overwrites the functions `add`, `clear` and `delete` of it. That means if you plan to overwrite the named `Set` functions by yourself, this library won't work. 

## Projects using vue-command

- [docker-management-dashboard](https://github.com/zero4994/docker-management-dashboard) - A management dashboard for your local docker containers
- [saber-theme-klieh](https://github.com/krmax44/saber-theme-klieh) - A Saber theme mimicking a terminal
- [ts-git](https://github.com/nfriend/ts-git) - A naïve implementation of git, written in TypeScript
- [curvy-idle-game](https://github.com/n4n0GH/curvy-idle-game) - Short idle game where you get to pat her

## Chuck Norris API

The Chuck Norris jokes are comming from [this](https://api.chucknorris.io/) API. This library has no relation to Chuck Norris or the services provided by the API.

## Author

[Julian Claus](https://www.julian-claus.de) and contributors. Special thanks to [krmax44](https://github.com/krmax44) for the amazing work!

I apologize to some contributors that are not in the Git history anymore since I had to delete the repository because of problems with [semantic-release](https://github.com/semantic-release/semantic-release). 

## License

MIT
