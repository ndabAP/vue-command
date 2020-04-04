import Vue from 'vue'

// Returns a component containing a span element with given inner content
export const createStdout = (content, isEscapeHtml = false, name) => ({
  name: name || 'VueCommandStdout',
  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

// Returns a dummy component to show a Stdin
export const createDummyStdout = (isInstance = true) => {
  if (isInstance) {
    const DummyStdout = Vue.extend({
      name: 'VueCommandDummyStdout',
      render: createElement => createElement('span', {}, '')
    })

    return new DummyStdout()
  }

  return {
    name: 'VueCommandDummyStdout',
    render: createElement => createElement('span', {}, '')
  }
}
