# vue-command

A fully working, most feature-rich Vue.js terminal emulator. See the
[demo](https://ndabap.github.io/vue-command/) and check the demo
[source code](https://github.com/ndabAP/vue-command/blob/master/src/hosted/App.vue).

## Features

- Simple, yet extensible API
- Supports asynchronous commands
- Supports fullscreen mode
- Customize the terminal with slots
- Provide your own parser (falls back to simple one)
- Provide your own event resolver
- Autocompletion resolver (with <kbd>↹</kbd>)
- Browse history (with <kbd>↑</kbd>/<kbd>↓</kbd>)
- Search history (with <kbd>Ctrl</kbd> + <kbd>r</kbd>) (comming soon)

## Installation

```bash
$ npm install vue-command --save
```

## Usage

Let's start with a dead simple example. We want to send "Hello world" to
`Stdout` when entering `hello-world`.

```vue
<template>
  <vue-command :commands="commands" />
</template>

<script>
import VueCommand, { createStdout } from "vue-command";
import "vue-command/dist/vue-command.css";

export default {
  components: {
    VueCommand,
  },

  data: () => ({
    commands: {
      "hello-world": () => createStdout("Hello world"),
    },
  }),
};
</script>
```

Now a more complex one. Let's assume we want to build the nano editor available
in many shells.

We inject `terminal` to make sure the editor is only visible when the terminal
is in fullscreen mode and also a function called `exit` to tell the terminal
that the command has been finished when the user enters
<kbd>Ctrl</kbd> + <kbd>x</kbd>. Furthermore, we use `setFullscreen` to
switch the terminal into fullscreen mode.

```vue
<template>
  <div v-show="terminal.isFullscreen">
    <textarea ref="nano" @keyup.ctrl.x.exact="exit">
This is a nano text editor emulator! Press Ctrl + x to leave.</textarea
    >
  </div>
</template>

<script lang="js">
export default {
  inject: ['exit', 'setFullscreen', 'terminal'],

  created () {
    this.setFullscreen(true)
  },

  mounted () {
    this.$refs.nano.focus()
  }
}
</script>

<style scoped>
div,
textarea {
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
import VueCommand from "vue-command";
import "vue-command/dist/vue-command.css";
import NanoEditor from "@/components/NanoEditor.vue";

export default {
  components: {
    VueCommand,
  },

  data: () => ({
    commands: {
      nano: () => NanoEditor,
    },
  }),
};
</script>
```

## Properties

Some properties can be changed, therefore, adding the `v-model` directive is
required.

| Property             | Description                                   | Type       | Default value             | Required | `v-model` |
| -------------------- | --------------------------------------------- | ---------- | ------------------------- | -------- | --------- |
| `commands`           | See [Commands](#commands)                     | `Object`   | `{}`                      | No       | No        |
| `cursor-position`    | Cursor position                               | `Number`   | `0`                       | No       | Yes       |
| `dispatched-queries` | Non-empty dispatched queries                  | `Set`      | `new Set()`               | No       | Yes       |
| `event-resolver`     | See [Event resolver](#Event-resolver) section | `Function` | `newDefaultEventResolver` | No       | No        |
| `help-text`          | Command help                                  | `String`   | `''`                      | No       | Yes       |
| `help-timeout`       | Command help timeout                          | `Number`   | `3000`                    | No       | No        |
| `hide-bar`           | Hides the bar                                 | `Boolean`  | `false`                   | No       | No        |
| `hide-prompt`        | Hides the prompt                              | `Boolean`  | `false`                   | No       | No        |
| `hide-title`         | Hides the title                               | `Boolean`  | `false`                   | No       | No        |
| `history`            | Terminal history                              | `Array`    | `[]`                      | No       | Yes       |
| `history-position`   | Points to the latest dispatched query entry   | `Number`   | `0`                       | No       | Yes       |
| `invert`             | Inverts the terminals colors                  | `Boolean`  | `false`                   | No       | No        |
| `is-fullscreen`      | Terminal fullscreen mode                      | `Boolean`  | `false`                   | No       | Yes       |
| `options-resolver`   | See [Options resolver](#Options-resolver)     | `Function` | `null`                    | No       | No        |
| `parser`             | Query parser                                  | `Function` | `defaultParser`           | No       | No        |
| `prompt`             | Terminal prompt                               | `String`   | `~$`                      | No       | No        |
| `show-help`          | Show query help                               | `Boolean`  | `false`                   | No       | No        |
| `title`              | Terminal title                                | `String`   | `~$`                      | No       | No        |
| `query`              | Terminal query                                | `String`   | `''`                      | No       | Yes       |

### Commands

`commands` must be an object containing key-value pairs where key is the command
and the value is a function that will be called with the parsed arguments. The
function can return a `Promise` and must return or resolve a Vue.js component.
To return strings or a new query, use one of the convenient helper methods.

### Event resolver

It's possible to provide an array property `eventResolver` which is called when
the terminal is mounted. Each event resolver will be called with the terminals
references and exposed values.

The libraries `defaultHistoryEventResolver` makes usage of that and allows to
cycle through commands with <kbd>↑</kbd>/<kbd>↓</kbd>.

### Options resolver

The terminal provides a built-in autocompletion for the given commands. As soon
as the query has been autocompleted by the terminal, it's calling the options
resolver provided as property. The resolver is called with the program, parsed
query and a setter to update the query.

## Slots

### Bar

You can replace the whole terminal bar with the named slot `bar`. This will
replace the whole element, including the action buttons and its assigned CSS
classes. Example:

```vue
<vue-command>
  <template #bar>
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  </template>
</vue-command>
```

### Buttons

Inside the bar, you can customize the buttons. Example:

```vue
<vue-command>
  <template #buttons>
    &times; &#95; &square;
  </template>
</vue-command>
```

### Title

Inside the bar, you can customize the title. If you use this slot, `hideTitle`
and `title` property have no effect. Example:

```vue
<vue-command>
  <template #title>
    bash - 720x350
  </template>
</vue-command>
```

## Library

Library provides helper methods to render terminal related content.

| Function                      | Parameters                                                         | Description                           |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `createCommandNotFound`       | `command, text = 'command not found', name = 'VueCommandNotFound'` | Creates a command not found component |
| `createStdout`                | `formatterOrText, name = 'VueCommandStdout'`                       | Creates a "stdout" component          |
| `createQuery`                 |                                                                    | Creates a query component             |
| `defaultHistoryEventResolver` | `refs, eventProvider`                                              | The default history event resolver    |
| `defaultParser`               | `query`                                                            | The default parser                    |
| `defaultSignalEventResolver`  | `refs, eventProvider`                                              | The default signal event resolver     |
| `jsonFormatter`               | `value`                                                            | See [Formatters](#formatters)         |
| `listFormatter`               | `...lis`                                                           | See [Formatters](#formatters)         |
| `newDefaultEventResolver`     |                                                                    | Returns a new default event resolver  |
| `newDefaultHistory`           |                                                                    | Returns a new default history         |
| `tableFormatter`              | `rows`                                                             | See [Formatters](#formatters)         |
| `textFormatter`               | `text, innerHtml = false`                                          | See [Formatters](#formatters)         |

Helper methods can be imported by name:

```js
import { createStdout, createQuery } from "vue-command";
```

### Formatters

The first argument of `createStdout` can be either a primitive
(`boolean`, `number` or `string`) or a formatter. A formatter formats the
content as a list or table or something else.

| Formatters       |
| ---------------- |
| `jsonFormatter`  |
| `listFormatter`  |
| `tableFormatter` |
| `textFormatter`  |

Formatters can be imported by name:

```js
import { listFormatter } from "vue-command";
```

## Provided

| Provided             |
| -------------------- |
| `addDispatchedQuery` |
| `appendToHistory`    |
| `dispatch`           |
| `decrementHistory`   |
| `exit`               |
| `helpText`           |
| `helpTimeout`        |
| `hidePrompt`         |
| `incrementHistory`   |
| `optionsResolver`    |
| `parser`             |
| `programs`           |
| `sendSignal`         |
| `setCursorPosition`  |
| `setFullscreen`      |
| `setHistoryPosition` |
| `showHelp`           |
| `signals`            |
| `setQuery`           |
| `terminal`           |

Provider can be injected into your component by name:

```js
inject: ["exit", "terminal"],
```

## Exposed

| Exposed              |
| -------------------- |
| `addDispatchedQuery` |
| `appendToHistory`    |
| `decrementHistory`   |
| `dispatch`           |
| `exit`               |
| `incrementHistory`   |
| `programs`           |
| `sendSignal`         |
| `setCursorPosition`  |
| `setFullscreen`      |
| `setHistoryPosition` |
| `setQuery`           |
| `signals`            |
| `terminal`           |

## Events

| Name                | Description                        |
| ------------------- | ---------------------------------- |
| `closeClicked`      | Emitted on button close click      |
| `minimizeClicked`   | Emitted on button minimize click   |
| `fullscreenClicked` | Emitted on button fullscreen click |

## Signals

You can send and receive signals like `SIGINT`, `SIGTERM` or `SIGKILL`. `SIGINT`
is the only implemented signal for now. When the user presses
<kbd>Ctrl</kbd> + <kbd>c</kbd>, you can listen to this event by providing a
signal name and a callback:

```js
const signals = inject("signals");
signals.on("SIGINT", () => console.debug("SIGINT"));
```

## Nice-to-haves

These features didn't make it into the last release. If you would like to
contribute please consult `CONTRIBUTING.md`.

- Draggable terminal
- More events (like query dispatched)
- More terminal slots
- Multi-line queriesd
- Syntax highlighting

## Browser support

This library uses the `ResizeObserver` to track if the terminals height changes.
You may need a pollyfill to support your target browser.

## Projects using vue-command

- [curvy-idle-game](https://github.com/n4n0GH/curvy-idle-game) - Short idle game
  where you get to pat her
- [docker-management-dashboard](https://github.com/zero4994/docker-management-dashboard) - A management dashboard for your local docker containers
- [saber-theme-klieh](https://github.com/krmax44/saber-theme-klieh) - A Saber
  theme mimicking a terminal
- [ts-git](https://github.com/nfriend/ts-git) - A naïve implementation of git,
  written in TypeScript
- [Venom](https://github.com/J0LGER/Venom) - Venom is a Command and Control framework

## Chuck Norris API

The Chuck Norris jokes are comming from [this](https://api.chucknorris.io/) API.
This library has no relation to Chuck Norris or the services provided by the
API.

## Author

[Julian Claus](https://www.julian-claus.de) and contributors. Special thanks to
[krmax44](https://github.com/krmax44) for the amazing work!

I apologize to some contributors that are not in the Git history anymore since I
had to delete the repository because of problems with
[semantic-release](https://github.com/semantic-release/semantic-release).

## License

MIT
