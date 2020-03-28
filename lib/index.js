// Returns a component containing a span element with given inner content
export const createComponent = (content, isEscapeHtml, mixins = []) => ({
  mixins,
  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

export const FullscreenMixin = {
  setIsFullscreen (isFullscreen) {
    this.$emit('setIsFullscreen', isFullscreen)
  }
}
