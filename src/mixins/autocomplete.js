// @vue/component
export default {
  provide () {
    return {
      setCursor: this.setCursor
    }
  },

  data: () => ({
    local: {
      // Current cursor position at STDIN
      cursor: 0
    }
  }),

  watch: {
    'local.cursor' () {
      this.$emit('update:cursor', this.local.cursor)
    }
  },

  methods: {
    // Calls the user given autocompletion resolver and sets the input accordingly
    autocomplete () {
      if (this.local.current && typeof this.autocompletionResolver === 'function') {
        const autocomplete = this.autocompletionResolver(this.local.current, this.local.cursor)

        this.bus.$emit('autocomplete', { stdin: autocomplete, uid: this._uid })
      }
    },

    setCursor (cursor) {
      this.local.cursor = cursor
    }
  }
}
