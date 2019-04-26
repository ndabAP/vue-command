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

  it('sets the intro', () => {
    const intro = Array.from(VueCommand.props.intro.default).reverse().join('')
    const wrapper = shallowMount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        showIntro: true,
        intro
      }
    })

    expect(wrapper.find('.term-cont:first-child').text()).toBe(intro)
  })

  it('sets the title', () => {
    const title = Array.from(VueCommand.props.title.default).reverse().join('')
    const wrapper = shallowMount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        title
      }
    })

    expect(wrapper.find('.term-title').text()).toBe(title)
  })
})
