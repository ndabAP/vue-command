import { getRandom, getMountedWrapper, getCommands } from './test-utilities'
import { ResizeObserver } from './polyfills'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

// eslint-disable-next-line
/* global jest */
global.ResizeObserver = ResizeObserver

const KEY_UP_EVENT = 'keyup.up'
const KEY_DOWN_EVENT = 'keyup.down'
const KEY_ENTER_EVENT = 'keyup.enter'

describe('Event listeners', () => {
  it('history', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getCommands(command))

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger(KEY_ENTER_EVENT)

    console.log(wrapper.vm.history)

    await wrapper.find('.term-cont').trigger(KEY_UP_EVENT)

    console.log(command, wrapper.vm.stdin)

    // expect(wrapper.findAllComponents(Stdout).at(1).text()).toBe(`${command}: ${notFound}`)
  })
})
