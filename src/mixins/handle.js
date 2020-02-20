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

      // Remove duplicate commands for a clear history
      let executed = new Set(this.executed)

      executed.delete(stdin)
      executed.add(stdin)

      let component
      if (!program) {
        // Empty command
        component = getComponent('')
      } else {
        this.$emit('update:executed', executed)

        const builtIn = this.builtIn[program]
        const command = this.commands[program]

        const isBuiltIn = typeof builtIn === 'function'
        const isCommand = typeof command === 'function'
        // Check if command has been found
        if (isCommand) {
          this.setIsInProgress(true)

          const parsed = yargsParser(stdin, this.yargsOptions)
          const stdout = await Promise.resolve(command(parsed))

          if (stdout === '') {
            // If result is empty, return empty string
            component = getComponent('')
          } else if (typeof stdout === 'string') {
            // Result is non-empty string
            component = getComponent(stdout)
          } else {
            // Result is component
            component = stdout
          }

          // Check if given component has computed properties
          if (!hasOwnProperty.call(component, 'computed')) {
            component.computed = {}
          }

          const history = this.history.length
          component.computed.$_arguments = () => parsed
          component.computed.$_isRunning = () => this.isInProgress && this.history.length === history
        } else if (isBuiltIn) {
          // Builtin
        } else {
          // No command found
          component = getComponent(`${stdin}: ${this.notFound}`, true)
        }
      }

      // Check if given component has mixins
      if (!hasOwnProperty.call(component, 'mixins')) {
        component.mixins = []
      }

      component.mixins.push({
        // Add helper methods
        methods: {
          $_done: () => {
            this.setPointer(executed.size)
            this.setIsInProgress(false)
            this.setIsFullscreen(false)

            this.$emit('executed', stdin)
          },

          $_setIsFullscreen: isFullscreen => {
            this.isFullscreen = isFullscreen
          },

          $_executeCommand: async command => {
            if (!this.isInProgress) {
              this.bus.$emit('setCommand', command)

              await this.$nextTick()

              this.handle(command)
            }
          }
        }
      })

      let history = [...this.history]
      history.push(component)
      this.$emit('update:history', [...history])

      this.$emit('update:current', '')
    }
  }
}

// Returns a component containing a span element with given inner content
const getComponent = (content, isEscapeHtml) => ({
  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  },

  mounted () {
    this.$_done()
  }
})
