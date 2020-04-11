import { ARROW_DOWN_KEY, ARROW_UP_KEY } from '../constants/keys'
import { createDummyStdout } from '../library'

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
    // Creates a new copy
    history () {
      this.setHistory([...this.history])
    },

    pointer () {
      this.setPointer(this.pointer)
    },

    'local.pointer' () {
      this.$emit('update:pointer', this.local.pointer)
    }
  },

  created () {
    // Let user provide the starting history
    let history = [...this.history]

    // If there is no entry push dummy Stdout to show Stdin
    if (history.length === 0) {
      history.push(createDummyStdout())

      this.setHistory([...history])
    } else {
      // Update the history property
      this.$emit('update:history', [...history])
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
      this.local.current = [...this.executed][this.local.pointer]
    },

    setHistory (history) {
      this.local.history = history
    },

    setPointer (pointer) {
      this.local.pointer = pointer
    }
  }
}
