import VueCommand from './components/VueCommand'

import Vue from 'vue'

// Returns a Stdout component containing a span element with given inner content
export const createStdout = (content, isEscapeHtml = false, name = 'VueCommandStdout') => ({
  name,
  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

// Returns a Stderr component containing a span element with given inner content
export const createStderr = (content, isEscapeHtml = false, name = 'VueCommandStderr') => ({
  name,
  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

// Returns a dummy Stdout component to not show a Stdout
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

export default VueCommand
