import { getMountedWrapper, getEmptyCommands } from './test-utilities'
import { ResizeObserver } from './polyfills'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

// eslint-disable-next-line
/* global jest */
global.ResizeObserver = ResizeObserver

describe('Slots', () => {
  it('has custom bar', () => {
    const wrapper = getMountedWrapper({}, getEmptyCommands(), { bar: '<div class="foo-bar"></div>' })

    expect(wrapper.find('.foo-bar').exists()).toBe(true)
  })

  it('has custom prompt', () => {
    const wrapper = getMountedWrapper({}, getEmptyCommands(), { prompt: '<div class="foo-bar"></div>' })

    expect(wrapper.find('.foo-bar').exists()).toBe(true)
  })
})
