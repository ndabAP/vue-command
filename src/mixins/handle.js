import yargsParser from 'yargs-parser'

import { createStdout, createDummyStdout } from '../library'

// @vue/component
export default {
  methods: {
    // Executes a regular command
    async execute (stdin) {
      const program = yargsParser(stdin, this.yargsOptions)._[0]
      // Create empty component in case no program has been found
      let component = createDummyStdout()
      // Check if command has been found
      if (typeof this.commands[program] === 'function') {
        // Parse the command and try to get the program
        const parsed = yargsParser(stdin, this.yargsOptions)

        component = await Promise.resolve(this.commands[program](parsed))
        component = this.setupComponent(component, this.local.history.length, parsed)

        // Remove duplicate commands to push to latest entry
        let executed = new Set(this.executed)
        executed.delete(stdin)
        executed.add(stdin)
        // Mutate property
        this.$emit('update:executed', executed)
      } else {
        // No command found
        if (stdin !== '') {
          component = createStdout(`${stdin}: ${this.notFound}`, true)
        }

        component = this.setupComponent(component, this.local.history.length)
      }

      this.setPointer(this.executed.size)

      let history = [...this.local.history]
      history.push(component)

      // Emit command executing started
      this.emitExecute()
      // Tell terminal there is a command in progress
      this.setIsInProgress(true)

      this.setHistory(history)
    },

    // Handles the command
    async handle (stdin) {
      // Remove leading and trailing whitespace
      stdin = stdin.trim()

      const program = yargsParser(stdin, this.yargsOptions)._[0]

      // Check if function is built in
      if (this.builtIn[program] !== undefined) {
        await Promise.resolve(this.builtIn[program](stdin))

        // The built in function must take care of all other steps
        return
      }

      // Start common command tasks
      this.execute(stdin)
    },

    // Add environment and instantly terminate
    setupComponent (component, history = 0, parsed = {}) {
      // Prevent to work with same reference
      component = { ...component }

      if (!hasOwnProperty.call(component, 'computed')) {
        component.computed = {}
      }
      component.computed = {
        environment: () => ({
          isExecuting: this.local.isInProgress && (this.local.history.length - 1 === history),
          isFullscreen: this.local.isFullscreen,
          isInProgress: this.local.isInProgress
        }),

        context: () => ({
          cursor: this.local.cursor,
          parsed
        }),

        ...component.computed
      }

      return component
    }
  }
}
