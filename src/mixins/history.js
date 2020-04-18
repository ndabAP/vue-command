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
    setHistory (history) {
      this.local.history = history
    },

    setPointer (pointer) {
      this.local.pointer = pointer
    }
  }
}
