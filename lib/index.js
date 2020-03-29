// Returns a component containing a span element with given inner content
export const createStdout = (content, isEscapeHtml = false, mixins = []) => ({
  mixins,
  inject: ['setIsInProgress'],

  mounted () {
    // Component is a string
    this.setIsInProgress(false)
  },

  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})
