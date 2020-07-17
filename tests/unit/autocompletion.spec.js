import { ResizeObserver } from './polyfills'
import {
  getRandom,
  getMountedWrapper,
  getCommands,
  getDefaultProps
} from './test-utilities'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

// eslint-disable-next-line
/* global jest */
global.ResizeObserver = ResizeObserver

// See: https://github.com/vuejs/vue-test-utils/issues/1497
describe('Autocompletion', () => {
  it('calls the autocompletion resolver with arguments', async () => {
    const command = getRandom()
    const autocompletionResolver = jest.fn(() => command)
    const wrapper = getMountedWrapper({ autocompletionResolver }, getCommands(command))

    wrapper.find('input').setValue(command)
    await wrapper.vm.$nextTick()

    wrapper.find('input').trigger('keydown.tab.prevent')
    await wrapper.vm.$nextTick()

    expect(autocompletionResolver.mock.calls.length).toBe(1)
  })
})
