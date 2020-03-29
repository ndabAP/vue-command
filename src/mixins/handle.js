import yargsParser from 'yargs-parser'

import { createStdout } from '../../lib'

// @vue/component
export default {
  methods: {
    // Handles the command
    async handle (stdin) {
      this.$emit('execute', stdin)

      this.setIsInProgress(true)

      // Remove leading and trailing whitespace
      stdin = stdin.trim()

      const program = yargsParser(stdin, this.yargsOptions)._[0]

      // Check if function is built in
      if (this.builtIn[program] !== undefined) {
        // Parse the command
        const parsed = yargsParser(stdin, this.yargsOptions)
        // Execute built in function
        await Promise.resolve(this.builtIn[program](parsed))

        // The built in function must take care of all other steps
        return
      }

      // Create empty component in case no program has been found
      let component = createStdout('')
      if (program) {
        const command = this.commands[program]
        // Command is not empty
        const isCommand = typeof command === 'function'
        // Check if command has been found
        if (isCommand) {
          // Parse the command and try to get the program
          const parsed = yargsParser(stdin, this.yargsOptions)
          component = await Promise.resolve(command(parsed))

          if (!hasOwnProperty.call(component, 'computed')) {
            component.computed = {}
          }

          // Preserve history length
          const history = this.history.length
          component.computed.environment = () => ({
            isExecuting: this.isInProgress && (this.history.length - 1 === history),
            isFullscreen: this.isFullscreen,
            isInProgress: this.isInProgress
          })

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

      this.$emit('executed', stdin)

      this.$emit('update:current', '')
    }
  }
}
