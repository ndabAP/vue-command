import VueCommand from './components/VueCommand'
import { ARROW_DOWN_KEY, ARROW_UP_KEY } from './constants/keys'

// Returns a Stdout component containing a span element with given inner content
export const createStdout = (content, isEscapeHtml = false, name = 'VueCommandStdout', ...mixins) => ({
  name,
  mixins,
  inject: ['terminate'],
  async mounted () {
    // Wait for user mutations
    await this.$nextTick()

    this.terminate()
  },

  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

// Returns a Stderr component containing a span element with given inner content
export const createStderr = (content, isEscapeHtml = false, name = 'VueCommandStderr', ...mixins) => ({
  name,
  mixins,
  inject: ['terminate'],
  async mounted () {
    // Wait for user mutations
    await this.$nextTick()

    this.terminate()
  },

  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

// Returns a dummy Stdout component to not show a Stdout
export const createDummyStdout = (...mixins) => ({
  name: 'VueCommandDummyStdout',
  mixins,
  inject: ['terminate'],
  async mounted () {
    // Wait for user mutations
    await this.$nextTick()

    this.terminate()
  },

  render: createElement => createElement('span', {}, '')
})

export const createPattern = ({
  altKey,
  codes,
  ctrlKey,
  isComposing,
  keys,
  locales,
  locations,
  metaKeys,
  repeat,
  shiftKey
}) => ({
  altKey,
  codes,
  ctrlKey,
  isComposing,
  keys,
  locales,
  locations,
  metaKeys,
  repeat,
  shiftKey
})

export const historyKeyboardResolver = {
  fn: ({
    methods: { setStdin, setPointer },
    context: { event: { key }, executed, pointer }
  }) => {
    // Check if pointer is mutable and input key is up or key
    if (key === ARROW_UP_KEY && pointer > 0) {
      pointer--
      setPointer(pointer)

      // Set current Stdin to pointed command
      setStdin([...executed][pointer])
    } else if (key === ARROW_DOWN_KEY && pointer < (executed.size - 1)) {
      pointer++
      setPointer(pointer)

      // Set current Stdin to pointed command
      setStdin([...executed][pointer])
    }
  },

  pattern: createPattern({ keys: [ARROW_UP_KEY, ARROW_DOWN_KEY] })
}

export default VueCommand
