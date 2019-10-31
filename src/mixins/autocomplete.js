// @vue/component
export default {
  data: () => ({
    // Current cursor position at STDIN
    cursor: 0
  }),

  methods: {
    // Calls the user given autocompletion resolver and sets the input accordingly
    autocomplete () {
      if (this.current && typeof this.autocompletionResolver === 'function') {
        const autocomplete = this.autocompletionResolver(this.current, this.cursor)

        this.bus.$emit('autocomplete', { command: autocomplete, uid: this._uid })
      }
    },

    setCursor (cursor) {
      this.cursor = cursor
    }
  }
}
