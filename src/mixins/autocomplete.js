import { EVENT_LISTENERS } from '../library'

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
    if (this.eventListeners.includes(EVENT_LISTENERS.__AUTOCOMPLETE)) {
      this.$refs['term-cont'].addEventListener('keydown', event => {
        if (event.keyCode === 9) {
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
