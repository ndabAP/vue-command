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

```js
<template>
    <vue-command :commands="{ whoami: () => 'me' }" />
</template>

<script>
import VueCommand from 'vue-command'
import 'vue-command/dist/vue-command.css'

export default {
    components: { VueCommand }
}
</script>
```

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
