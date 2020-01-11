import yargsParser from 'yargs-parser'

// @vue/component
export default {
  methods: {
    // Handles the command
    async handle (stdin) {
      // Remove leading and trailing whitespace
      stdin = stdin.trim()

      this.$emit('execute', stdin)

      // Parse the command and try to get the program
      const program = yargsParser(stdin, this.yargsOptions)._[0]

      if (!program) {
        // Empty command
        this.history.push(null)
      } else {
        const command = this.commands[program]
        const builtIn = this.builtIn[program]

        const isBuiltIn = typeof builtIn === 'function'
        const isCommand = typeof command === 'function'

        // Check if built-in or command has been found
        if (isCommand) {
          // Remove duplicate commands for a clear history
          this.executed.delete(stdin)
          this.executed.add(stdin)

          this.history.push('')
          this.setIsInProgress(true)

          const stdout = await Promise.resolve(
            command(yargsParser(stdin, this.yargsOptions))
          )

          // Add program result to history
          this.history[this.history.length - 1] = stdout
          // Point to latest command plus one
          this.setPointer(this.executed.size)

          this.setIsInProgress(false)
        } else if (isBuiltIn) {
          this.setIsInProgress(true)

          await Promise.resolve(builtIn(yargsParser(stdin, this.yargsOptions)))

          this.setPointer(this.executed.size)
          this.setIsInProgress(false)
        } else this.history.push(`${stdin}: ${this.notFound}`)
      }

      this.setCurrent('')
      this.setCursor(0)

      this.$emit('executed', stdin)
    }
  }
}
