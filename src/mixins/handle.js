import getOpts from 'getopts'

import { createStderr, createDummyStdout } from '../library'

// Split Stdin into chunks to parse it correctly.
// See: https://stackoverflow.com/a/18647776 and see: https://github.com/ndabAP/vue-command/issues/176
const accommodateTokens = stdin => {
  // Contains the tokens to merge option-value pairs
  const tokens = []
  // Contains the current token pair for each iteration
  let tokenPairs = []
  const tokenPairsExpression = /[^\s"]+|"([^"]*)"/gi
  // Iterate through all tokens
  do {
    tokenPairs = tokenPairsExpression.exec(stdin)

    if (tokenPairs != null) {
      tokens.push(tokenPairs[1] ? tokenPairs[1] : tokenPairs[0])
    }
  } while (tokenPairs != null)

  // Contains accommodated tokens to parse
  const accommodatedTokens = []
  let isNextTokenOptionValue = false
  tokens.forEach((token, index) => {
    // Check if next token is option value
    if (isNextTokenOptionValue) {
      isNextTokenOptionValue = false

      return
    }

    // Check if option has value assigned
    if (token.endsWith('=')) {
      // Merge option with value
      accommodatedTokens.push(token + tokens[index + 1])

      isNextTokenOptionValue = true
    } else {
      // Token is not part of option-value pair
      accommodatedTokens.push(token)
    }
  })

  return accommodatedTokens
}

// @vue/component
export default {
  provide () {
    return {
      terminate: this.terminate
    }
  },

  methods: {
    // Handles the command
    async handle (stdin) {
      // First token is program
      const program = stdin.trim().split(' ')[0]

      // Check if command is regular command
      if (typeof this.commands[program] === 'function') {
        // Check if command is regular command
        await Promise.resolve(this.execute(stdin))

        return
      }

      // Check if command might be built-in
      if (typeof this.builtIn === 'function') {
        await Promise.resolve(this.builtIn(stdin, this))

        // The built in function must take care of all other steps
        return
      }

      // Command must be empty or can't be found
      this.commandNotFound(stdin)
    },

    // Executes a regular command
    async execute (stdin) {
      // Remove leading and trailing whitespace
      stdin = stdin.trim()

      const program = getOpts(stdin.split(' '), this.parserOptions)._[0]
      // Create empty component in case no program has been found
      let component = createDummyStdout()

      const accommodatedTokens = accommodateTokens(stdin)
      const parsed = getOpts(accommodatedTokens, this.parserOptions)

      component = await Promise.resolve(this.commands[program](parsed))
      component = this.setupComponent(component, this.local.history.length, parsed)

      // Disallow empty Stdin in history
      if (stdin !== '') {
        // Remove duplicate commands to push to latest entry
        const executed = new Set(this.local.executed)
        executed.delete(stdin)
        executed.add(stdin)

        // Mutate property
        this.$emit('update:executed', executed)
        this.setExecuted(executed)
      }

      // Point history to new command
      this.setPointer(this.local.executed.size)

      const history = [...this.local.history]
      history.push(component)

      // Emit command executing started
      this.emitExecute()
      // Tell terminal there is a command in progress
      this.setIsInProgress(true)

      this.setHistory(history)
      // Update the history property
      this.$emit('update:history', [...history])
    },

    // Command is empty or not found
    commandNotFound (stdin) {
      let component = createDummyStdout()
      // Only non empty commands should be
      if (stdin !== '') {
        // No command found
        component = createStderr(`${stdin}: ${this.notFound}`, true)
        component = this.setupComponent(component, this.local.history.length)

        // Remove duplicate commands to push to latest entry
        const executed = new Set(this.local.executed)
        executed.delete(stdin)
        executed.add(stdin)

        // Mutate property
        this.$emit('update:executed', executed)
        this.setExecuted(executed)

        // Point history to new command
        this.setPointer(this.local.executed.size)
      }

      const history = [...this.local.history]
      history.push(component)

      // Emit command executing started
      this.emitExecute()
      // Tell terminal there is a command in progress
      this.setIsInProgress(true)

      this.setHistory(history)
      // Update the history property
      this.$emit('update:history', [...history])
    },

    // Add environment and context and instantly terminate
    setupComponent (component, entries = 0, parsed = {}) {
      // Prevent to work with same reference
      component = { ...component }

      if (!hasOwnProperty.call(component, 'computed')) {
        component.computed = {}
      }
      // Create copies
      const cursor = this.local.cursor
      const executed = new Set(this.local.executed)
      const history = [...this.local.history]
      const pointer = this.local.pointer
      const stdin = this.local.stdin
      component.computed = {
        environment: () => ({
          isExecuting: this.local.isInProgress && (this.local.history.length - 1 === entries),
          isFullscreen: this.local.isFullscreen,
          isInProgress: this.local.isInProgress
        }),

        context: () => ({
          cursor,
          executed,
          history,
          parsed,
          pointer,
          stdin
        }),

        ...component.computed
      }

      return component
    },

    // Executes common final tasks after command has been finished
    terminate () {
      // Set new Stdin to empty
      this.setStdin('')
      // Exit fullscreen if necessary
      this.setIsFullscreen(false)
      // Indicate end of command
      this.$emit('executed')
      // Allow new Stdin
      this.setIsInProgress(false)
    }
  }
}
