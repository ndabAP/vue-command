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

  methods: {
    // Calls the user given autocompletion resolver and sets the current Stdin accordingly
    autocomplete () {
      if (this.local.stdin && typeof this.autocompletionResolver === 'function') {
        // Retrieve users generated autocompletion result
        const stdin = this.autocompletionResolver(this.local.stdin, this.local.cursor)

        this.setStdin(stdin)
      }
    },

    setCursor (cursor) {
      this.local.cursor = cursor
    }
  }
}
