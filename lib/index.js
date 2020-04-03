// Returns a component containing a span element with given inner content
export const createStdout = (content, isEscapeHtml = false) => ({
  inject: ['terminate'],

  async mounted () {
    await this.$nextTick()
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
