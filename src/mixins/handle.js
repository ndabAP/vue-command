import yargsParser from 'yargs-parser'

import { createComponent } from '../../lib/index'

// @vue/component
export default {
  methods: {
    // Handles the command
    async handle (stdin) {
      this.$emit('execute', stdin)
      // Remove leading and trailing whitespace
      stdin = stdin.trim()

      if (this.builtIn[stdin] !== undefined) {
        return this.builtIn[stdin]()
      }

      // Parse the command and try to get the program
      const program = yargsParser(stdin, this.yargsOptions)._[0]

      // Remove duplicate commands for a clear history
      let executed = new Set(this.executed)

      executed.delete(stdin)
      executed.add(stdin)

      let component
      if (!program) {
        // Empty command
        component = createComponent('')

        let history = [...this.history]
        history.push(component)
        this.$emit('update:history', [...history])

        this.$emit('update:current', '')
      } else {
        const command = this.commands[program]
        const isCommand = typeof command === 'function'
        // Check if command has been found
        if (isCommand) {
          this.setIsInProgress(true)

          const parsed = yargsParser(stdin, this.yargsOptions)
          const stdout = await Promise.resolve(command(parsed))

          if (stdout === '') {
            // If result is empty, return empty string
            component = createComponent('')
          } else {
            // Result is component
            component = stdout
          }

          this.$emit('update:executed', executed)

          let history = [...this.history]
          history.push(component)
          this.$emit('update:history', [...history])

          this.$emit('update:current', '')
        } else {
          // No command found
          component = createComponent(`${stdin}: ${this.notFound}`, true)

          let history = [...this.history]
          history.push(component)

          this.$emit('update:history', [...history])
          this.$emit('update:current', '')
        }
      }
    }
  }
}
