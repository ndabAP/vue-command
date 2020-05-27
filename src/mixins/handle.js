import getOpts from 'getopts'

import { createStderr, createDummyStdout } from '../library'

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
      // Remove leading and trailing whitespace
      stdin = stdin.trim()

      const program = getOpts(stdin.split(' '), this.parserOptions)._[0]

      // Check if function is built in
      if (this.builtIn[program] !== undefined) {
        await Promise.resolve(this.builtIn[program](stdin))

        // The built in function must take care of all other steps
        return
      }

      // Execute the regular command
      this.execute(stdin)
    },

    // Executes a regular command
    async execute (stdin) {
      const program = getOpts(stdin.split(' '), this.parserOptions)._[0]
      // Create empty component in case no program has been found
      let component = createDummyStdout()

      // Check if command has been found
      if (typeof this.commands[program] === 'function') {
        // Parse the command and try to get the program
        const parsed = getOpts(stdin.split(' '), this.parserOptions)

        component = await Promise.resolve(this.commands[program](parsed))
        component = this.setupComponent(component, this.local.history.length, parsed)
      } else {
        // No command found
        if (stdin !== '') {
          component = createStderr(`${stdin}: ${this.notFound}`, true)
        }

        component = this.setupComponent(component, this.local.history.length)
      }

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
