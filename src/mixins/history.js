import size from 'lodash/size'
import eq from 'lodash/eq'
import gt from 'lodash/gt'
import lt from 'lodash/lt'
import get from 'lodash/get'
import { and, inc, dec } from 'ramda'

import { ARROW_DOWN_KEY, ARROW_UP_KEY } from '../constants/keys'

// @vue/component
export default {
  data: () => ({
    // All executed commands
    history: [''],
    // Last pointed command
    last: '',
    // History command pointer
    pointer: 0
  }),

  methods: {
    // Lets user navigate through history based on input key
    mutatePointerHandler ({ key }) {
      // Check if pointer is mutable and input key is up key
      const isMutablePointerAndUpKey = and(
        eq(key, ARROW_UP_KEY),
        gt(this.pointer, 0)
      )

      if (isMutablePointerAndUpKey) {
        this.setPointer(dec(this.pointer))
        this.setLast(get(this.executed, this.pointer))
      }

      // Check if pointer is mutable and input key is down key
      const isMutablePointerAndDownKey = and(
        eq(key, ARROW_DOWN_KEY),
        lt(this.pointer, dec(size(this.executed)))
      )

      if (isMutablePointerAndDownKey) {
        this.setPointer(inc(this.pointer))
        this.setLast(get(this.executed, this.pointer))
      }
    },

    setPointer (pointer) {
      this.pointer = pointer
    }
  }
}
