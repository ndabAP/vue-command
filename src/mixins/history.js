// @vue/component
export default {
  provide () {
    return {
      setPointer: this.setPointer
    }
  },

  data: () => ({
    local: {
      executed: new Set(),
      // All executed commands
      history: [],
      // History command pointer
      pointer: 0
    }
  }),

  watch: {
    history () {
      // Creates a new copy to prevent mutation
      this.setHistory([...this.history])
    },

    'local.pointer' () {
      this.$emit('update:pointer', this.local.pointer)
    },

    pointer () {
      this.setPointer(this.pointer)
    }
  },

  methods: {
    increaseHistory () {
      // Check if pointer is mutable
      if (this.local.pointer < (this.local.executed.size - 1)) {
        this.local.pointer++

        // Set new pointed Stdin
        this.local.stdin = [...this.local.executed][this.local.pointer]
      }
    },

    decreaseHistory () {
      // Check if pointer is mutable
      if (this.local.pointer > 0) {
        this.local.pointer--

        // Set new pointed Stdin
        this.local.stdin = [...this.local.executed][this.local.pointer]
      }
    },

    setExecuted (executed) {
      this.local.executed = executed
    },

    setHistory (history) {
      this.local.history = history
    },

    setPointer (pointer) {
      this.local.pointer = pointer
    }
  }
}
