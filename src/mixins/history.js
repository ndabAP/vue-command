import { ARROW_DOWN_KEY, ARROW_UP_KEY } from '../constants/keys'

// @vue/component
export default {
  data: function () {
    return {
      // All executed commands
      history: [{ stdout: undefined, prompt: this.$props.prompt }],
      // Last pointed command
      last: '',
      // History command pointer
      pointer: 0
    }
  },

  methods: {
    // Lets user navigate through history based on input key
    mutatePointerHandler ({ key }) {
      if (key === ARROW_UP_KEY && this.pointer > 0) {
        // Check if pointer is mutable and input key is up key
        this.pointer--
      } else if (key === ARROW_DOWN_KEY && this.pointer < (this.executed.size - 1)) {
        // Check if pointer is mutable and input key is down key
        this.pointer++
      } else {
        return
      }

      this.last = [...this.executed][this.pointer]
    },

    setPointer (pointer) {
      this.pointer = pointer
    }
  }
}
