import yargsParser from 'yargs-parser'

import { createStdout } from '../../lib'

// @vue/component
export default {
  methods: {
    // Handles the command
    async handle (stdin) {
      // Remove leading and trailing whitespace
      stdin = stdin.trim()

      const program = yargsParser(stdin, this.yargsOptions)._[0]

      // Check if function is built in
      if (this.builtIn[program] !== undefined) {
        // Parse the command
        const parsed = yargsParser(stdin, this.yargsOptions)
        let component = await Promise.resolve(this.builtIn[program](parsed))
        component = this.setupComponent(component, this.history.length, parsed)

        let history = [...this.history]
        history.push(component)
        this.$emit('update:history', [...history])

        // The built in function must take care of all other steps
        return
      }

      this.setIsInProgress(true)

      this.$emit('execute', stdin)

      // Create empty component in case no program has been found
      let component = createStdout('')
      if (program) {
        // Check if command has been found
        if (typeof this.commands[program] === 'function') {
          // Parse the command and try to get the program
          const parsed = yargsParser(stdin, this.yargsOptions)
          component = await Promise.resolve(this.commands[program](parsed))
          component = this.setupComponent(component, this.history.length, parsed)

          component.bind(this)

          // Remove duplicate commands to push to latest entry
          let executed = new Set(this.executed)
          executed.delete(stdin)
          executed.add(stdin)
          this.$emit('update:executed', executed)
        } else {
          // No command found
          component = createStdout(`${stdin}: ${this.notFound}`, true)
        }
      }

      let history = [...this.history]
      history.push(component)
      this.$emit('update:history', [...history])
    },

    setupComponent (component, history, parsed) {
      // Prevent to work with same reference
      component = { ...component }

      if (!hasOwnProperty.call(component, 'computed')) {
        component.computed = {}
      }

      component.computed = {
        environment: () => ({
          isExecuting: this.isInProgress && (this.history.length - 1 === history),
          isFullscreen: this.isFullscreen,
          isInProgress: this.isInProgress
        }),

        context: () => ({
          cursor: this.cursor,
          parsed
        }),

        ...component.computed
      }

      return component
    }
  }
}
