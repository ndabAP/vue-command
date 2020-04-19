// @vue/component
export default {
  provide () {
    return {
      setPointer: this.setPointer
    }
  },

  data: () => ({
    local: {
      // All executed commands
      history: [],
      // History command pointer
      pointer: 0
    }
  }),

  watch: {
    history () {
      // Creates a new copy
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
      if (this.local.pointer < (this.executed.size - 1)) {
        this.local.pointer++

        // Set new pointed Stdin
        this.local.stdin = [...this.executed][this.local.pointer]
      }
    },

    decreaseHistory () {
      // Check if pointer is mutable
      if (this.local.pointer > 0) {
        this.local.pointer--

        // Set new pointed Stdin
        this.local.stdin = [...this.executed][this.local.pointer]
      }
    },

    setHistory (history) {
      this.local.history = history
    },

    setPointer (pointer) {
      this.local.pointer = pointer
    }
  }
}
