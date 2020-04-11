import { ARROW_DOWN_KEY, ARROW_UP_KEY } from '../constants/keys'

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

    pointer () {
      this.setPointer(this.pointer)
    },

    'local.pointer' () {
      this.$emit('update:pointer', this.local.pointer)
    }
  },

  methods: {
    // Lets user navigate through history based on input key
    mutatePointerHandler ({ key }) {
      if (key === ARROW_UP_KEY && this.local.pointer > 0) {
        // Check if pointer is mutable and input key is up key
        this.local.pointer--
      } else if (key === ARROW_DOWN_KEY && this.local.pointer < (this.executed.size - 1)) {
        // Check if pointer is mutable and input key is down key
        this.local.pointer++
      } else {
        return
      }

      // Set current Stdin to pointed command
      this.local.stdin = [...this.executed][this.local.pointer]
    },

    setHistory (history) {
      this.local.history = history
    },

    setPointer (pointer) {
      this.local.pointer = pointer
    }
  }
}
