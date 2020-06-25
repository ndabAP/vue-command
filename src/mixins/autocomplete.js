import { EVENT_LISTENERS } from '../library'
import { TAB_KEY } from '../constants/keys'

// @vue/component
export default {
  provide () {
    return {
      setCursor: this.setCursor
    }
  },

  data: () => ({
    local: {
      // Current cursor position at Stdin
      cursor: 0
    }
  }),

  watch: {
    cursor () {
      this.local.cursor = this.cursor
    },

    'local.cursor' () {
      this.$emit('update:cursor', this.local.cursor)
    }
  },

  mounted () {
    // Check if user wants autocompletion
    if (this.eventListeners.includes(EVENT_LISTENERS.autocomplete)) {
      this.$refs['term-cont'].addEventListener('keydown', event => {
        if (event.keyCode === TAB_KEY) {
          event.preventDefault()

          this.autocomplete()
        }
      })
    }
  },

  methods: {
    // Calls the user given autocompletion resolver
    autocomplete () {
      // Check if autocompletion resolver is given
      if (typeof this.autocompletionResolver === 'function') {
        // Call user autocompletion function
        this.autocompletionResolver()
      }
    },

    setCursor (cursor) {
      this.local.cursor = cursor
    }
  }
}
