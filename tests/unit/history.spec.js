import {
  getRandom,
  getMountedWrapper,
  getEmptyCommands
} from './test-utilities'
import { ResizeObserver } from './polyfills'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

// eslint-disable-next-line
/* global jest */
global.ResizeObserver = ResizeObserver

const KEY_ENTER_EVENT = 'keyup.enter'

describe('Commands', () => {
  it('finds the previous command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getEmptyCommands())

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger(KEY_ENTER_EVENT)
    await wrapper.find('input').trigger('keyup.ArrowUp')

    expect(wrapper.get('input').element.value).toBe(command)
  })
})
