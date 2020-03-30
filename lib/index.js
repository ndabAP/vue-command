import module from '../src/store/index'

// Returns a component containing a span element with given inner content
export const createStdout = (content, isEscapeHtml = false, mixins = []) => ({
  mixins,
  inject: ['terminate'],

  mounted () {
    // Component is a string
    this.terminate()
  },

  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

export const install = (Vue, options) => {
  if (!options.store) {
    throw new Error('Error: Please provide a Vuex store')
  }

  options.store.registerModule(options.module, module)
}
