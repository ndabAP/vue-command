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
        // Remove duplicate commands for a clear history
        this.executed.delete(stdin)
        this.executed.add(stdin)

        const builtIn = this.builtIn[program]
        const command = this.commands[program]

        const builtInOrCommand = builtIn || command

        const isBuiltIn = typeof builtIn === 'function'
        const isCommand = typeof command === 'function'

        // Check if built-in or command has been found
        if (isBuiltIn || isCommand) {
          this.history.push('')
          this.setIsInProgress(true)

          const stdout = await Promise.resolve(
            builtInOrCommand(yargsParser(stdin, this.yargsOptions), isBuiltIn ? {
              current: this.current,
              executed: this.executed,
              isInProgress: this.isInProgress
            } : undefined)
          )

          // Add program result to history
          this.history[this.history.length - 1] = stdout
          // Point to latest command plus one
          this.setPointer(this.executed.size)

          this.setIsInProgress(false)
          this.$emit('executed', stdin)
        } else this.history.push(`${stdin}: ${this.notFound}`)
      }

      this.setCurrent('')
    }
  }
}
