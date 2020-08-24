import { ResizeObserver } from './polyfills'
import {
  getRandom,
  getMountedWrapper,
  getCommand
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
    const wrapper = getMountedWrapper({ autocompletionResolver }, getCommand(command))

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger('keydown.tab.prevent')

    expect(autocompletionResolver.mock.calls.length).toBe(1)
  })
})
