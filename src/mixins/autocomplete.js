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
    'local.cursor' () {
      this.$emit('update:cursor', this.local.cursor)
    }
  },

  methods: {
    // Calls the user given autocompletion resolver and sets the current input accordingly
    autocomplete () {
      if (this.local.current && typeof this.autocompletionResolver === 'function') {
        // Retrieve users generated autocompletion result
        const autocomplete = this.autocompletionResolver(this.local.current, this.local.cursor)

        this.setCurrent(autocomplete)
      }
    },

    setCursor (cursor) {
      this.local.cursor = cursor
    }
  }
}
