import Vue from 'vue'
import has from 'lodash/has'
import head from 'lodash/head'
import cloneDeep from 'lodash/cloneDeep'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import invoke from 'lodash/invoke'
import trim from 'lodash/trim'
import without from 'lodash/without'
import { or, dec } from 'ramda'
import yargsParser from 'yargs-parser'

// @vue/component
export default {
  methods: {
    // Handles the command
    async handle (command) {
      // Remove leading and trailing whitespace
      command = trim(command)

      this.$emit('execute', command)

      // Parse the command and try to get the program
      const program = head(yargsParser(command, this.yargsOptions)._)

      if (isEmpty(program)) {
        // Empty command
        this.history.push(null)
      }

      if (!isEmpty(program)) {
        let executed = cloneDeep(this.executed)
        // Remove duplicate commands for a clear history
        executed = without(executed, command)
        executed.push(command)

        this.setExecuted(executed)

        const isBuiltIn = has(this.builtIn, program)
        const isCommand = has(this.commands, program)

        // Check if command has been found
        if (or(isBuiltIn, isCommand)) {
          this.history.push('')
          this.setIsInProgress(true)

          let stdout = ''
          if (isBuiltIn) {
            stdout = await Promise.resolve(
              invoke(this.builtIn, program, yargsParser(command, this.yargsOptions), this.$data)
            )
          }

          if (isCommand) {
            stdout = await Promise.resolve(
              invoke(this.commands, program, yargsParser(command, this.yargsOptions))
            )
          }

          // Add program result to history
          Vue.set(this.history, dec(size(this.history)), stdout)
          // Point to latest command plus one
          this.setPointer(size(executed))

          this.setIsInProgress(false)
          this.$emit('executed', command)
        } else this.history.push(`${command}: ${this.notFound}`)
      }

      this.setCurrent('')
    }
  }
}
