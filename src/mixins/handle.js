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
          this.history.push(undefined)
          this.setIsInProgress(true)

          let stdout = await Promise.resolve(
            fn(yargsParser(command, this.yargsOptions), isBuiltIn ? this.$data : undefined)
          )

          if (typeof stdout === 'string') {
            stdout = stringAsComponent(stdout)
          }

          if (!stdout.mixins) stdout.mixins = []

          stdout.mixins.push({
            methods: {
              $done: () => {
                this.setPointer(this.executed.size)
                this.setIsInProgress(false)
                this.$emit('executed', command)
              }
            }
          })

          // Add program result to history
          this.history.pop()
          this.history.push(stdout)
        } else {
          const component = stringAsComponent(`${command}: ${this.notFound}`)

          this.history.push(component)
          this.setIsInProgress(false)
        }
      }

      this.setCurrent('')
    }
  }
}

function stringAsComponent (innerHTML) {
  return {
    render (h) {
      return h('span', {
        domProps: { innerHTML }
      })
    },
    mounted () {
      this.$done()
    }
  }
}
