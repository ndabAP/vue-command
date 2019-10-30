import yargsParser from 'yargs-parser'

// @vue/component
export default {
  methods: {
    // Handles the command
    async handle (command) {
      // Remove leading and trailing whitespace
      command = command.trim()

      this.$emit('execute', command)

      // Parse the command and try to get the program
      const program = yargsParser(command, this.yargsOptions)._[0]

      if (!program) {
        // Empty command
        this.history.push(null)
      } else {
        // Remove duplicate commands for a clear history
        this.executed.delete(command)
        this.executed.add(command)

        const isBuiltIn = this.builtIn[program]
        const isCommand = this.commands[program]
        const fn = isBuiltIn || isCommand

        // Check if command has been found
        if (fn) {
          this.history.push('')
          this.setIsInProgress(true)

          const stdout = await Promise.resolve(
            fn(yargsParser(command, this.yargsOptions), isBuiltIn ? this.$data : undefined)
          )

          // Add program result to history
          this.history[this.history.length - 1] = stdout
          // Point to latest command plus one
          this.setPointer(this.executed.size)

          this.setIsInProgress(false)
          this.$emit('executed', command)
        } else this.history.push(`${command}: ${this.notFound}`)
      }

      this.setCurrent('')
    }
  }
}
