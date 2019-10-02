import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import keys from 'lodash/keys'
import invoke from 'lodash/invoke'
import eq from 'lodash/eq'
import startsWith from 'lodash/startsWith'
import find from 'lodash/find'
import { and } from 'ramda'
import yargsParser from 'yargs-parser'

import { TAB_KEY } from '../keys'

// @vue/component
export default {
  methods: {
    autocomplete ({ key }) {
      const isAutocompleteable = and(eq(key, TAB_KEY), !isEmpty(this.current))

      // Check for available program to autocomplete
      if (and(isAutocompleteable, isUndefined(this.currentProgram))) {
        const command = find(keys(this.commands), command => startsWith(command, this.current))
        if (!isUndefined(command)) {
          this.bus.$emit('autocomplete', { command, uid: this._uid })

          return
        }
      }

      // At the point, there is a program available
      if (and(isAutocompleteable, !isEmpty(this.autocompletionResolver))) {
        const command = yargsParser(this.current, this.yargsOptions)
        const autocomplete = invoke(this.autocompletionResolver, this.currentProgram, command)

        this.bus.$emit('autocomplete', { command: `${autocomplete}`, uid: this._uid })
      }
    }
  }
}
