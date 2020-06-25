import VueCommand from './components/VueCommand'

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
export const createDummyStdout = (name = 'VueCommandDummyStdout', ...mixins) => ({
  name,
  mixins,
  inject: ['terminate'],
  async mounted () {
    // Wait for user mutations
    await this.$nextTick()

    this.terminate()
  },

  render: createElement => createElement('span', {}, '')
})

// Default event listeners to opt-in
export const EVENT_LISTENERS = {
  // Autocompletion when pressing "Tab" key
  autocomplete: 0,

  // History search when pressing up or down key
  history: 1,

  // Search mode when pressing "Ctlr" plus "R"
  search: 2
}

export default VueCommand
