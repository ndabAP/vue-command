import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import { and } from 'ramda'

// @vue/component
export default {
  data: () => ({
    // Current cursor position at STDIN
    cursor: 0
  }),

  methods: {
    // Calls the user given autocompletion resolver and sets the input accordingly
    autocomplete ({ key }) {
      if (and(!isEmpty(this.current), !isNull(this.autocompletionResolver))) {
        const autocomplete = this.autocompletionResolver(this.current, this.cursor)

        this.bus.$emit('autocomplete', { command: `${autocomplete}`, uid: this._uid })
      }
    },

    setCursor (cursor) {
      this.cursor = cursor
    }
  }
}
