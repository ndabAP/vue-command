import { mount, shallowMount } from '@vue/test-utils'
import VueCommand from '../../src/VueCommand'
import Stdin from '../../src/Stdin'

const EMPTY_COMMANDS = { commands: { null: () => null } }

describe('VueCommand.vue', () => {
  it('hides the bar', () => {
    const wrapper = shallowMount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        hideBar: true
      }
    })

    expect(wrapper.contains('.term-bar')).toBe(false)
  })

  it('sets the intro', () => {
    const intro = Math.random().toString(36).substring(8)
    const wrapper = mount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        intro
      }
    })
  })
})