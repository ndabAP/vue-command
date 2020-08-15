import { getRandom, getMountedWrapper, getCommand } from './test-utilities'
import Stdout from '../../src/components/Stdout'
import { ResizeObserver } from './polyfills'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

// eslint-disable-next-line
/* global jest */
global.ResizeObserver = ResizeObserver

const KEY_UP_EVENT = 'keyup.up'
const KEY_ENTER_EVENT = 'keyup.enter'
const KEY_TAB_EVENT = 'keyup.tab'

describe('Event listeners', () => {
  describe('Autocomplete', () => {
    it('autcompletes one result', async () => {
      const command = getRandom()
      const wrapper = getMountedWrapper({}, getCommand(command))

      wrapper.find('input').setValue(command)
      await wrapper.find('input').trigger(KEY_ENTER_EVENT)

      wrapper.vm.local.stdin = command.slice(0, -1)
      await wrapper.find('.term-cont').trigger(KEY_TAB_EVENT)

      expect(wrapper.find('input').element.value).toBe(command)
    })
  })

  describe('History', () => {
    it('finds previous entry', async () => {
      const command = getRandom()
      const wrapper = getMountedWrapper({}, getCommand(command))

      wrapper.find('input').setValue(command)
      await wrapper.find('input').trigger(KEY_ENTER_EVENT)

      await wrapper.find('.term-cont').trigger(KEY_UP_EVENT)
      await wrapper.find('input').trigger(KEY_ENTER_EVENT)

      expect(wrapper.findAllComponents(Stdout).at(1).text()).toBe(command)
    })
  })
})
