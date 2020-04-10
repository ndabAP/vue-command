// @vue/component
export default {
  data: () => ({
    local: {
      // Current cursor position at STDIN
      cursor: 0
    }
  }),

  methods: {
    // Calls the user given autocompletion resolver and sets the input accordingly
    autocomplete () {
      if (this.local.current && typeof this.autocompletionResolver === 'function') {
        const autocomplete = this.autocompletionResolver(this.local.current, this.local.cursor)

        this.bus.$emit('autocomplete', { command: autocomplete, uid: this._uid })
      }
    },

    setCursor (cursor) {
      this.local.cursor = cursor
      this.$emit('update:cursor', cursor)
    }
  }
}
