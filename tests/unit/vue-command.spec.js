import { shallowMount } from '@vue/test-utils'
import VueCommand from '../../src/VueCommand'

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

  it('sets the title', () => {
    const reversed = Array.from(VueCommand.props.title.default).reverse().join('')
    const wrapper = shallowMount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        title: reversed
      }
    })

    expect(wrapper.find('.term-title').text()).toBe(reversed)
  })
})
