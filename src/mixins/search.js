import { EVENT_LISTENERS } from '../library'
import { R_KEY } from '../constants/keys'

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

  mounted () {
    // Check if user wants search
    if (this.eventListeners.includes(EVENT_LISTENERS.search)) {
      if (this.disableHistory) {
        return
      }

      this.$refs['term-cont'].addEventListener('keydown', event => {
        // Check if user clicks "Ctrl" and "R" simultaneously
        if (event.ctrlKey && event.keyCode === R_KEY) {
          event.preventDefault()

          this.setIsSearchHandler()
        }
      })
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
