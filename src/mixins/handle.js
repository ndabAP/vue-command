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
        this.history.push(undefined)
      } else {
        // Remove duplicate commands for a clear history
        this.executed.delete(command)
        this.executed.add(command)

        const isBuiltIn = this.builtIn[program]
        const isCommand = this.commands[program]
        const fn = isBuiltIn || isCommand

        let component

        // Check if command has been found
        if (fn) {
          this.history.push(undefined)
          const i = this.history.length
          this.setIsInProgress(true)

          const args = yargsParser(command, this.yargsOptions)
          let stdout = await Promise.resolve(
            fn(args, isBuiltIn ? this.$data : undefined)
          )

          if (!stdout) {
            component = stringAsComponent('')
          } else if (typeof stdout === 'string') {
            component = stringAsComponent(stdout)
          } else {
            component = stdout
          }

          if (!component.computed) component.computed = {}
          component.computed.$arguments = () => args
          component.computed.$running = () => this.isInProgress && this.history.length === i

          this.history.pop()
        } else {
          component = stringAsComponent(`${command}: ${this.notFound}`, true)
        }

        if (!component.mixins) component.mixins = []

        component.mixins.push({
          methods: {
            $done: () => {
              this.setPointer(this.executed.size)
              this.setIsInProgress(false)
              this.fullscreen = false
              this.$emit('executed', command)
            },
            $goFullscreen: () => {
              this.fullscreen = true
            },
            $leaveFullscreen: () => {
              this.fullscreen = false
            },
            $executeCommand: async command => {
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

function stringAsComponent (content, escapeHtml) {
  return {
    render (h) {
      return h('span', {
        domProps: { [escapeHtml ? 'innerText' : 'innerHTML']: content }
      })
    },
    mounted () {
      this.$done()
    }
  }
}
