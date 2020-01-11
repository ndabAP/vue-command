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
        this.history.push(undefined)
      } else {
        // Remove duplicate commands for a clear history
        this.executed.delete(stdin)
        this.executed.add(stdin)

        const builtIn = this.builtIn[program]
        const command = this.commands[program]

        const builtInOrCommand = builtIn || command

        let component

        // Check if command has been found
        if (typeof builtInOrCommand === 'function') {
          this.history.push(undefined)
          const history = this.history.length

          this.setIsInProgress(true)

          const parsed = yargsParser(stdin, this.yargsOptions)
          const stdout = await Promise.resolve(
            builtInOrCommand(parsed, typeof builtin === 'function' ? this.$data : undefined)
          )

          if (stdout === '') {
            // If result is empty, return empty string
            component = stringAsComponent('')
          } else if (typeof stdout === 'string') {
            // Result is non-empty string
            component = stringAsComponent(stdout)
          } else {
            // Result is component
            component = stdout
          }

          // Check if given component has computed properties
          if (!hasOwnProperty.call(component, 'computed')) {
            component.computed = {}
          }
          component.computed.$_arguments = () => parsed
          component.computed.$_isRunning = () => this.isInProgress && this.history.length === history

          this.history.pop()
        } else {
          // No command found
          component = stringAsComponent(`${stdin}: ${this.notFound}`, true)
        }

        // Check if given component has mixins
        if (!hasOwnProperty.call(component, 'mixins')) {
          component.mixins = []
        }
        component.mixins.push({
          // Add helper methods
          methods: {
            $_done: () => {
              this.setPointer(this.executed.size)
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

        this.history.push(component)
      }

      this.setCurrent('')
    }
  }
}

const stringAsComponent = (content, escapeHtml) => ({
  render: h => {
    if (escapeHtml) {
      return h('span', {}, content)
    }
    return h('span', { domProps: { innerHTML: content } })
  },

  mounted () {
    this.$_done()
  }
})
