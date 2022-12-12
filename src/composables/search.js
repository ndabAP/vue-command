// @vue/component
export default {
  data: () => ({
    isSearch: false
  }),

  watch: {
    async isSearch () {
      if (!this.isSearch) {
        await this.$nextTick()

        const stdins = this.$refs.stdin
        // Latest Stdin is latest history entry
        const stdin = stdins[this.local.history.length - 1]

        // Call component method
        stdin.focus()
      }
    }
  },

  methods: {
    // Let the user search inside the "executed" "Set"
    setIsSearchHandler () {
      if (!this.isInProgress) {
        this.setIsSearch(true)
      }
    },

    setIsSearch (isSearch) {
      this.isSearch = isSearch
    }
  }
}
